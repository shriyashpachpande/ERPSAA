const HostelCheckInLog = require('../../models/hostel-management/HostelCheckInLog');
const HostelAllocation = require('../../models/hostel-management/HostelAllocation');
const HostelApplication = require('../../models/hostel-management/HostelApplication');
const StudentMaster = require('../../models/student-master/StudentMaster');

// @desc    Perform check-in for a student
// @route   POST /api/hostel/staff/check-in
// @access  Private (Hostel Staff)
exports.checkIn = async (req, res) => {
  try {
    const { allocationId, studentId, remarks } = req.body;

    let allocation;
    if (allocationId) {
      allocation = await HostelAllocation.findById(allocationId);
    } else if (studentId) {
      // Find StudentMaster record first to get student._id
      const studentMaster = await StudentMaster.findOne({ studentId: studentId });
      if (!studentMaster) return res.status(404).json({ success: false, error: 'Student profile not found' });
      
      allocation = await HostelAllocation.findOne({ studentId: studentMaster._id, status: 'Active' });
    }

    if (!allocation || allocation.status !== 'Active') {
      return res.status(404).json({ success: false, error: 'Active hostel allocation not found for this student' });
    }

    const log = await HostelCheckInLog.create({
      allocationId: allocation._id,
      studentId: allocation.studentId,
      type: 'Check-In',
      remarks: remarks || 'Student checked in by staff',
      performedBy: req.user.id
    });

    // Update HostelApplication status
    if (allocation.applicationId) {
      await HostelApplication.findByIdAndUpdate(allocation.applicationId, { status: 'CheckedIn' });
    }

    // Update StudentMaster status if needed
    const student = await StudentMaster.findById(allocation.studentId);
    if (student) {
      student.modules.hostel.status = 'checked_in';
      student.modules.hostel.lastUpdated = new Date();
      student.markModified('modules.hostel');
      await student.save();
    }

    res.status(201).json({
      success: true,
      message: 'Student checked in successfully',
      data: log
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Perform check-out for a student
// @route   POST /api/hostel/staff/check-out
// @access  Private (Hostel Staff)
exports.checkOut = async (req, res) => {
  try {
    const { allocationId, studentId, remarks } = req.body;

    let allocation;
    if (allocationId) {
      allocation = await HostelAllocation.findById(allocationId);
    } else if (studentId) {
      const studentMaster = await StudentMaster.findOne({ studentId: studentId });
      if (!studentMaster) return res.status(404).json({ success: false, error: 'Student profile not found' });
      
      allocation = await HostelAllocation.findOne({ studentId: studentMaster._id, status: 'Active' });
    }

    if (!allocation || allocation.status !== 'Active') {
      return res.status(404).json({ success: false, error: 'Active hostel allocation not found for this student' });
    }

    const log = await HostelCheckInLog.create({
      allocationId: allocation._id,
      studentId: allocation.studentId,
      type: 'Check-Out',
      remarks: remarks || 'Student checked out by staff',
      performedBy: req.user.id
    });

    // Update HostelApplication status (maybe back to Allocated? or just leave as CheckedIn/History)
    // The user's list says "Check-in Pending" -> "Checked-in"
    // If they check out, they are done with this application.
    if (allocation.applicationId) {
      await HostelApplication.findByIdAndUpdate(allocation.applicationId, { status: 'Allocated' }); // Revert to allocated or keep as history
    }

    // Update StudentMaster status if needed
    const student = await StudentMaster.findById(allocation.studentId);
    if (student) {
      student.modules.hostel.status = 'checked_out';
      student.modules.hostel.lastUpdated = new Date();
      student.markModified('modules.hostel');
      await student.save();
    }

    res.status(201).json({
      success: true,
      message: 'Student checked out successfully',
      data: log
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get check-in/out logs for a student
// @route   GET /api/hostel/staff/logs/:studentId
// @access  Private (Hostel Staff)
exports.getStudentLogs = async (req, res) => {
  try {
    const logs = await HostelCheckInLog.find({ studentId: req.params.studentId })
      .populate('performedBy', 'fullName')
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get operational KPIs for check-in/out
// @route   GET /api/hostel/staff/check-in-out/stats
// @access  Private (Hostel Staff)
exports.getCheckInOutStats = async (req, res) => {
  try {
    const pendingCheckIns = await HostelApplication.countDocuments({ status: 'Approved' });
    const activeResidents = await StudentMaster.countDocuments({ 'modules.hostel.status': 'checked_in' });
    
    // For pending check-outs, we could count those who are checked_in but nearing end of year, 
    // or just look for 'Allocated' but not yet 'Checked-In' as a different KPI.
    // Let's use a simpler set for now.
    const totalAllocations = await HostelAllocation.countDocuments({ status: 'Active' });

    res.status(200).json({
      success: true,
      data: {
        pendingCheckIns,
        activeResidents,
        pendingCheckOuts: 0, // Placeholder if no specific "Pending Check-out" status exists yet
        totalAllocations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get detailed student hostel profile by string ID
// @route   GET /api/hostel/staff/student-profile/:studentId
// @access  Private (Hostel Staff)
exports.getStudentHostelProfile = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await StudentMaster.findOne({ studentId })
      .populate('userId', 'fullName email')
      .lean();

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const allocation = await HostelAllocation.findOne({ 
      studentId: student._id, 
      status: 'Active' 
    })
    .populate('hostelId', 'name type')
    .populate('blockId', 'name')
    .populate('floorId', 'name')
    .populate('roomId', 'roomNumber roomType')
    .populate('bedId', 'bedNumber')
    .lean();

    const logs = await HostelCheckInLog.find({ studentId: student._id })
      .populate('performedBy', 'fullName')
      .sort({ timestamp: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        student,
        allocation,
        logs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
