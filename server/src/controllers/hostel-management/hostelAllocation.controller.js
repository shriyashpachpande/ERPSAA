const mongoose = require('mongoose');
const HostelAllocation = require('../../models/hostel-management/HostelAllocation');
const HostelApplication = require('../../models/hostel-management/HostelApplication');
const HostelBed = require('../../models/hostel-management/HostelBed');
const HostelRoom = require('../../models/hostel-management/HostelRoom');
const StudentMaster = require('../../models/student-master/StudentMaster');
const StudentFeeAccount = require('../../models/fees-management/StudentFeeAccount');

// @desc    Allocate a bed to a student
// @route   POST /api/hostel/staff/allocate
// @access  Private (Hostel Staff)
exports.allocateBed = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { applicationId, bedId, hostelId, blockId, floorId, roomId, studentId, hostelFeeAmount, feeDescription } = req.body;

    // 1. Validate application
    const application = await HostelApplication.findById(applicationId).session(session);
    if (!application || application.status !== 'Approved') {
      throw new Error('Application must be in "Approved" status for allocation');
    }

    // 2. Validate bed availability
    const bed = await HostelBed.findById(bedId).session(session);
    if (!bed || bed.status !== 'Vacant') {
      throw new Error('Selected bed is not available');
    }

    // 3. Check for existing active allocation
    const existingAllocation = await HostelAllocation.findOne({
      studentId: studentId,
      status: 'Active'
    }).session(session);

    if (existingAllocation) {
      throw new Error('Student already has an active hostel allocation');
    }

    // 4. Create Allocation record
    const allocation = await HostelAllocation.create([{
      applicationId,
      studentId,
      bedId,
      roomId,
      floorId,
      blockId,
      hostelId,
      allocationDate: new Date(),
      status: 'Active'
    }], { session });

    // 5. Update Bed status
    bed.status = 'Occupied';
    bed.currentStudent = studentId;
    await bed.save({ session });

    // 6. Update Room occupancy count
    const room = await HostelRoom.findById(roomId).session(session);
    room.occupiedCount += 1;
    if (room.occupiedCount >= room.capacity) {
      room.isAvailable = false;
    }
    await room.save({ session });

    // 7. Update Application status
    application.status = 'Allocated';
    await application.save({ session });

    // 8. Integrate with Fees Module
    let feeAccount = await StudentFeeAccount.findOne({ studentId }).session(session);
    if (feeAccount) {
      const charge = {
        amount: Number(hostelFeeAmount),
        description: feeDescription || 'Hostel Fee Allocation',
        date: new Date(),
        status: 'pending'
      };

      feeAccount.hostelCharges.push(charge);
      feeAccount.totalOtherCharges += Number(hostelFeeAmount);
      feeAccount.totalPayable += Number(hostelFeeAmount);
      // Balance will be updated via pre-save hook in StudentFeeAccount model
      await feeAccount.save({ session });
    }

    // 9. Update StudentMaster module status
    const student = await StudentMaster.findById(studentId).session(session);
    if (student) {
      student.modules.hostel = {
        status: 'allocated',
        lastUpdated: new Date(),
        notes: `Allocated to ${room.roomNumber}, Bed ${bed.bedNumber}`
      };
      student.markModified('modules.hostel');
      await student.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Bed allocated successfully and fee updated',
      data: allocation[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Vacate a student from a bed (Check-out)
// @route   PUT /api/hostel/staff/vacate/:id
// @access  Private (Hostel Staff)
exports.vacateBed = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const allocation = await HostelAllocation.findById(req.params.id).session(session);
    if (!allocation || allocation.status !== 'Active') {
      throw new Error('Active allocation not found');
    }

    // 1. Update Allocation record
    allocation.status = 'Vacated';
    allocation.vacatedDate = new Date();
    await allocation.save({ session });

    // 2. Update Bed status
    const bed = await HostelBed.findById(allocation.bedId).session(session);
    bed.status = 'Vacant';
    bed.currentStudent = null;
    await bed.save({ session });

    // 3. Update Room occupancy count
    const room = await HostelRoom.findById(allocation.roomId).session(session);
    room.occupiedCount = Math.max(0, room.occupiedCount - 1);
    room.isAvailable = true;
    await room.save({ session });

    // 4. Update StudentMaster module status
    const student = await StudentMaster.findById(allocation.studentId).session(session);
    if (student) {
      student.modules.hostel = {
        status: 'vacated',
        lastUpdated: new Date(),
        notes: `Vacated from ${room.roomNumber}`
      };
      student.markModified('modules.hostel');
      await student.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Student vacated successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current allocation for logged-in student
// @route   GET /api/hostel/my-room
// @access  Private (Student)
exports.getMyRoom = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const allocation = await HostelAllocation.findOne({ 
      studentId: student._id,
      status: 'Active' 
    })
    .populate('hostelId', 'name type')
    .populate('blockId', 'name')
    .populate('floorId', 'floorNumber name')
    .populate('roomId', 'roomNumber roomType capacity')
    .populate('bedId', 'bedNumber');

    // Map student module status to a user-friendly check-in status
    let checkInStatus = 'Pending';
    if (student.modules?.hostel?.status === 'checked_in') checkInStatus = 'Checked In';
    if (student.modules?.hostel?.status === 'checked_out' || student.modules?.hostel?.status === 'vacated') checkInStatus = 'Checked Out';

    res.status(200).json({
      success: true,
      data: {
        ...allocation.toObject(),
        checkInStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
