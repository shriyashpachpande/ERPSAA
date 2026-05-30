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

// Helper function containing the core allocation logic (handles optional transaction session)
const performAllocation = async (data, session) => {
  const { 
    applicationId, 
    bedId, 
    roomId, 
    studentId, 
    hostelId, 
    hostelFeeAmount, 
    feeDescription 
  } = data;

  // 1. Fetch related data
  const bedQuery = HostelBed.findById(bedId);
  const roomQuery = HostelRoom.findById(roomId);
  const appQuery = HostelApplication.findById(applicationId);

  if (session) {
    bedQuery.session(session);
    roomQuery.session(session);
    appQuery.session(session);
  }

  const [bed, room, app] = await Promise.all([
    bedQuery,
    roomQuery,
    appQuery
  ]);

  if (!bed) throw new Error('Selected bed not found');
  if (bed.status !== 'Vacant') throw new Error('Selected bed is already occupied');
  if (!room) throw new Error('Selected room not found');
  if (!app) throw new Error('Hostel application not found');

  // Fetch floor to get blockId (required for allocation record)
  const floorQuery = HostelFloor.findById(room.floorId);
  if (session) floorQuery.session(session);
  const floor = await floorQuery;
  if (!floor) throw new Error('Structure error: Floor not found for selected room');

  // 2. STRICT VALIDATIONS
  const activeBedQuery = HostelAllocation.findOne({ bedId, status: 'Active' });
  const activeStudentQuery = HostelAllocation.findOne({ studentId, status: 'Active' });
  if (session) {
    activeBedQuery.session(session);
    activeStudentQuery.session(session);
  }
  const [activeBedAllocation, activeStudentAllocation] = await Promise.all([
    activeBedQuery,
    activeStudentQuery
  ]);

  if (activeBedAllocation) throw new Error('This bed already has an active occupant.');
  if (activeStudentAllocation) throw new Error('This student already has an active hostel allocation.');

  // 3. CREATE ALLOCATION
  const allocation = await HostelAllocation.create([{
    applicationId,
    studentId,
    bedId,
    roomId,
    floorId: room.floorId,
    blockId: floor.blockId,
    hostelId: hostelId || app.preferredHostelId,
    allocationDate: new Date(),
    status: 'Active'
  }], session ? { session } : {});

  // 4. UPDATE BED
  bed.status = 'Occupied';
  bed.currentStudent = studentId;
  await bed.save(session ? { session } : {});

  // 5. UPDATE ROOM
  room.occupiedCount += 1;
  if (room.occupiedCount >= room.capacity) room.isAvailable = false;
  await room.save(session ? { session } : {});

  // 6. UPDATE APPLICATION
  app.status = 'Allocated';
  await app.save(session ? { session } : {});

  // 7. FEE INTEGRATION
  const feeAccountQuery = StudentFeeAccount.findOne({ studentId });
  if (session) feeAccountQuery.session(session);
  const feeAccount = await feeAccountQuery;
  if (feeAccount) {
    feeAccount.hostelCharges.push({
      amount: Number(hostelFeeAmount),
      description: feeDescription || 'Hostel Fee',
      date: new Date(),
      status: 'pending'
    });
    feeAccount.totalOtherCharges += Number(hostelFeeAmount);
    feeAccount.totalPayable += Number(hostelFeeAmount);
    await feeAccount.save(session ? { session } : {});
  }

  // 8. STUDENT STATUS SYNC
  const studentQuery = StudentMaster.findById(studentId);
  if (session) studentQuery.session(session);
  const student = await studentQuery;
  if (student) {
    student.modules.hostel = {
      status: 'allocated',
      lastUpdated: new Date(),
      notes: `Allocated Room ${room.roomNumber}`
    };
    student.markModified('modules.hostel');
    await student.save(session ? { session } : {});
  }

  return allocation[0];
};

// @desc    Step 5: Perform the actual allocation
// @route   POST /api/hostel/allocation/assign
exports.assignBed = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await performAllocation(req.body, session);
      await session.commitTransaction();
      session.endSession();
      
      return res.status(201).json({ 
        success: true, 
        message: 'Bed successfully allocated',
        data: result 
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      const isTransactionError = error.message.includes('transaction') || 
                                 error.message.includes('Transaction') || 
                                 error.message.includes('replica set') ||
                                 error.code === 251 || 
                                 error.code === 20;

      if (isTransactionError) {
        console.warn('[Hostel Allocation] MongoDB Transactions not supported. Retrying with direct non-transactional fallback...');
        throw { isTransactionFallback: true };
      }
      throw error;
    }
  } catch (fallbackError) {
    if (fallbackError.isTransactionFallback) {
      // Direct sequential execution fallback (for standalone local databases)
      try {
        const result = await performAllocation(req.body, null);
        return res.status(201).json({ 
          success: true, 
          message: 'Bed successfully allocated (fallback mode)',
          data: result 
        });
      } catch (error) {
        console.error('CRITICAL ALLOCATION ERROR (FALLBACK):', error);
        return res.status(500).json({ 
          success: false, 
          error: error.message,
          message: 'Allocation failed (non-transactional)' 
        });
      }
    }
    console.error('CRITICAL ALLOCATION ERROR:', fallbackError);
    return res.status(500).json({ 
      success: false, 
      error: fallbackError.message,
      message: 'Transaction failed during room allocation' 
    });
  }
};
