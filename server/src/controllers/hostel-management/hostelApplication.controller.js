const HostelApplication = require('../../models/hostel-management/HostelApplication');
const StudentMaster = require('../../models/student-master/StudentMaster');
const Hostel = require('../../models/hostel-management/Hostel');

// @desc    Submit a new hostel application
// @route   POST /api/hostel/apply
// @access  Private (Student)
exports.applyForHostel = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    // Check if student already has a pending or approved application
    const existingApplication = await HostelApplication.findOne({
      studentId: student._id,
      status: { $in: ['Pending', 'Approved', 'Waitlisted', 'Allocated'] }
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, error: 'You already have an active hostel application' });
    }

    const applicationData = {
      studentId: student._id,
      ...req.body
    };

    const application = await HostelApplication.create(applicationData);

    res.status(201).json({
      success: true,
      message: 'Hostel application submitted successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get student's own hostel application status
// @route   GET /api/hostel/my-application
// @access  Private (Student)
exports.getMyApplication = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const application = await HostelApplication.findOne({ studentId: student._id })
      .populate('preferredHostelId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all hostel applications (for staff)
// @route   GET /api/hostel/staff/applications
// @access  Private (Hostel Staff)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await HostelApplication.find()
      .populate({
        path: 'studentId',
        select: 'personalDetails studentId academicProfile'
      })
      .populate('preferredHostelId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update application status (Approve/Reject/Waitlist)
// @route   PUT /api/hostel/staff/applications/:id/status
// @access  Private (Hostel Staff)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const application = await HostelApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    application.status = status;
    application.adminRemarks = adminRemarks;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
