const HostelComplaint = require('../../models/hostel-management/HostelComplaint');
const StudentMaster = require('../../models/student-master/StudentMaster');
const HostelAllocation = require('../../models/hostel-management/HostelAllocation');

// @desc    Submit a new hostel complaint
// @route   POST /api/hostel/complaints
// @access  Private (Student)
exports.submitComplaint = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const allocation = await HostelAllocation.findOne({ studentId: student._id, status: 'Active' });
    if (!allocation) {
      return res.status(400).json({ success: false, error: 'You must have an active hostel allocation to file a complaint' });
    }

    const complaint = await HostelComplaint.create({
      studentId: student._id,
      hostelId: allocation.hostelId,
      roomId: allocation.roomId,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get student's own complaints
// @route   GET /api/hostel/my-complaints
// @access  Private (Student)
exports.getMyComplaints = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const complaints = await HostelComplaint.find({ studentId: student._id })
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all complaints (for staff)
// @route   GET /api/hostel/staff/complaints
// @access  Private (Hostel Staff)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await HostelComplaint.find()
      .populate('studentId', 'personalDetails.fullName studentId')
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber')
      .sort({ status: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/hostel/staff/complaints/:id
// @access  Private (Hostel Staff)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const complaint = await HostelComplaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.remarks = remarks;
    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = req.user.id;
    }
    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
