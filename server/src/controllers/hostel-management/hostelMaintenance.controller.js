const HostelMaintenance = require('../../models/hostel-management/HostelMaintenance');
const StudentMaster = require('../../models/student-master/StudentMaster');
const HostelAllocation = require('../../models/hostel-management/HostelAllocation');

// @desc    Submit a new maintenance request
// @route   POST /api/hostel/maintenance
// @access  Private (Student)
exports.submitRequest = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const allocation = await HostelAllocation.findOne({ studentId: student._id, status: 'Active' });
    if (!allocation) {
      return res.status(400).json({ success: false, error: 'You must have an active hostel allocation to submit a maintenance request' });
    }

    const request = await HostelMaintenance.create({
      studentId: student._id,
      hostelId: allocation.hostelId,
      roomId: allocation.roomId,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance request submitted successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get student's own requests
// @route   GET /api/hostel/my-requests
// @access  Private (Student)
exports.getMyRequests = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const requests = await HostelMaintenance.find({ studentId: student._id })
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all requests (for staff)
// @route   GET /api/hostel/staff/requests
// @access  Private (Hostel Staff)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await HostelMaintenance.find()
      .populate('studentId', 'personalDetails.fullName studentId')
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber')
      .sort({ urgency: -1, status: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update maintenance request status
// @route   PUT /api/hostel/staff/requests/:id
// @access  Private (Hostel Staff)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, remarks, assignedTo } = req.body;
    const request = await HostelMaintenance.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    request.status = status;
    request.remarks = remarks;
    if (assignedTo) request.assignedTo = assignedTo;
    if (status === 'Resolved') {
      request.resolvedAt = new Date();
    }
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Maintenance request updated successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
