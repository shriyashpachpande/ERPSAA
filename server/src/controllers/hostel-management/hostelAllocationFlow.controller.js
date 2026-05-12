const mongoose = require('mongoose');
const Hostel = require('../../models/hostel-management/Hostel');
const HostelBlock = require('../../models/hostel-management/HostelBlock');
const HostelFloor = require('../../models/hostel-management/HostelFloor');
const HostelRoom = require('../../models/hostel-management/HostelRoom');
const HostelBed = require('../../models/hostel-management/HostelBed');
const HostelApplication = require('../../models/hostel-management/HostelApplication');
const HostelAllocation = require('../../models/hostel-management/HostelAllocation');
const StudentMaster = require('../../models/student-master/StudentMaster');
const StudentFeeAccount = require('../../models/fees-management/StudentFeeAccount');

// @desc    Step 1: Get all hostels for selection
// @route   GET /api/hostel/allocation/hostels
exports.getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ isActive: true });
    
    // Explicit mapping to ensure NO null _id
    const hostalList = hostels.map(h => ({
      _id: h._id.toString(),
      name: h.name,
      type: h.type,
      totalCapacity: h.totalCapacity || 0,
      isActive: h.isActive
    }));

    res.status(200).json({
      success: true,
      data: hostalList
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Step 2: Get hierarchy for a hostel (Blocks -> Floors -> Rooms)
// @route   GET /api/hostel/allocation/hierarchy/:hostelId
exports.getHostelHierarchy = async (req, res) => {
  try {
    const { hostelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ success: false, error: 'Invalid Hostel ID' });
    }

    const blocks = await HostelBlock.find({ hostelId });
    
    const hierarchy = await Promise.all(blocks.map(async (block) => {
      const floors = await HostelFloor.find({ blockId: block._id });
      
      const floorsWithRooms = await Promise.all(floors.map(async (floor) => {
        const rooms = await HostelRoom.find({ floorId: floor._id });
        return {
          ...floor.toObject(),
          rooms
        };
      }));

      return {
        ...block.toObject(),
        floors: floorsWithRooms
      };
    }));

    res.status(200).json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Step 3: Get beds for a specific room
// @route   GET /api/hostel/allocation/beds/:roomId
exports.getRoomBeds = async (req, res) => {
  try {
    const { roomId } = req.params;
    const beds = await HostelBed.find({ roomId }).populate('currentStudent', 'personalDetails.fullName studentId');
    
    res.status(200).json({
      success: true,
      data: beds
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Step 4: Get approved students for allocation
// @route   GET /api/hostel/allocation/students
exports.getAllocationReadyStudents = async (req, res) => {
  try {
    const apps = await HostelApplication.find({ status: 'Approved' })
      .populate('studentId', 'personalDetails.fullName studentId');
    
    res.status(200).json({
      success: true,
      data: apps
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Step 5: Perform the actual allocation
// @route   POST /api/hostel/allocation/assign
exports.assignBed = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      applicationId, 
      bedId, 
      roomId, 
      studentId, 
      hostelId, // IMPORTANT: Now properly destructured
      hostelFeeAmount, 
      feeDescription 
    } = req.body;

    // 1. Fetch related data
    const [bed, room, app] = await Promise.all([
      HostelBed.findById(bedId).session(session),
      HostelRoom.findById(roomId).session(session),
      HostelApplication.findById(applicationId).session(session)
    ]);

    if (!bed) throw new Error('Selected bed not found');
    if (bed.status !== 'Vacant') throw new Error('Selected bed is already occupied');
    if (!room) throw new Error('Selected room not found');
    if (!app) throw new Error('Hostel application not found');

    // Fetch floor to get blockId (required for allocation record)
    const floor = await HostelFloor.findById(room.floorId).session(session);
    if (!floor) throw new Error('Structure error: Floor not found for selected room');

    // 2. STRICT VALIDATIONS
    // - Bed vacancy double-check
    const activeBedAllocation = await HostelAllocation.findOne({ bedId, status: 'Active' }).session(session);
    if (activeBedAllocation) throw new Error('This bed already has an active occupant.');

    // - Student double-allocation check
    const activeStudentAllocation = await HostelAllocation.findOne({ studentId, status: 'Active' }).session(session);
    if (activeStudentAllocation) throw new Error('This student already has an active hostel allocation.');

    // 3. CREATE ALLOCATION
    const allocation = await HostelAllocation.create([{
      applicationId,
      studentId,
      bedId,
      roomId,
      floorId: room.floorId,
      blockId: floor.blockId,
      hostelId: hostelId || app.preferredHostelId, // Fallback to app's preference if needed
      allocationDate: new Date(),
      status: 'Active'
    }], { session });

    // 4. UPDATE BED
    bed.status = 'Occupied';
    bed.currentStudent = studentId;
    await bed.save({ session });

    // 5. UPDATE ROOM
    room.occupiedCount += 1;
    if (room.occupiedCount >= room.capacity) room.isAvailable = false;
    await room.save({ session });

    // 6. UPDATE APPLICATION
    app.status = 'Allocated';
    await app.save({ session });

    // 7. FEE INTEGRATION
    const feeAccount = await StudentFeeAccount.findOne({ studentId }).session(session);
    if (feeAccount) {
      feeAccount.hostelCharges.push({
        amount: Number(hostelFeeAmount),
        description: feeDescription || 'Hostel Fee',
        date: new Date(),
        status: 'pending'
      });
      feeAccount.totalOtherCharges += Number(hostelFeeAmount);
      feeAccount.totalPayable += Number(hostelFeeAmount);
      await feeAccount.save({ session });
    }

    // 8. STUDENT STATUS SYNC
    const student = await StudentMaster.findById(studentId).session(session);
    if (student) {
      student.modules.hostel = {
        status: 'allocated',
        lastUpdated: new Date(),
        notes: `Allocated Room ${room.roomNumber}`
      };
      student.markModified('modules.hostel');
      await student.save({ session });
    }

    await session.commitTransaction();
    res.status(201).json({ 
      success: true, 
      message: 'Bed successfully allocated',
      data: allocation[0] 
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('CRITICAL ALLOCATION ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Transaction failed during room allocation'
    });
  } finally {
    session.endSession();
  }
};
