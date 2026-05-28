const BonafideRequest = require('../../models/academic/BonafideRequest');
const StudentMaster = require('../../models/student-master/StudentMaster');
const StudentSemesterEnrollment = require('../../models/academic/StudentSemesterEnrollment');

const augmentRequests = async (requests) => {
  const augmented = [];
  for (let req of requests) {
    const reqObj = req.toObject();
    if (reqObj.studentId) {
      const enrollment = await StudentSemesterEnrollment.findOne({ studentMasterId: reqObj.studentId._id })
        .populate('semesterId', 'semesterName semesterNumber')
        .populate('academicYearId', 'name')
        .sort({ createdAt: -1 });

      if (enrollment) {
        reqObj.semester = enrollment.semesterId?.semesterName || `Sem ${reqObj.studentId.academicProfile?.currentSemester || 1}`;
        reqObj.academicYear = enrollment.academicYearId?.name || "N/A";
      } else {
        reqObj.semester = `Sem ${reqObj.studentId.academicProfile?.currentSemester || 1}`;
        reqObj.academicYear = "N/A";
      }
    } else {
      reqObj.semester = "N/A";
      reqObj.academicYear = "N/A";
    }
    augmented.push(reqObj);
  }
  return augmented;
};

// @desc    Apply for a bonafide certificate
// @route   POST /api/academic/bonafide/request
// @access  Private (Student)
exports.requestBonafide = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const { reason, customReason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, error: 'Please provide a reason for the request' });
    }

    // Check for an existing pending request
    const existingPending = await BonafideRequest.findOne({ 
      studentId: student._id, 
      status: 'pending' 
    });

    if (existingPending) {
      return res.status(400).json({ 
        success: false, 
        error: 'You already have an active pending bonafide request' 
      });
    }

    const newRequest = await BonafideRequest.create({
      studentId: student._id,
      reason,
      customReason: reason === 'other' ? customReason : undefined,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get my bonafide request history
// @route   GET /api/academic/bonafide/my-requests
// @access  Private (Student)
exports.getMyBonafideRequests = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const requests = await BonafideRequest.find({ studentId: student._id })
      .populate({
        path: 'studentId',
        select: 'personalDetails.fullName studentId academicProfile.course academicProfile.currentSemester'
      })
      .sort({ createdAt: -1 });

    const augmented = await augmentRequests(requests);
    res.status(200).json({ success: true, data: augmented });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all pending bonafide requests
// @route   GET /api/academic/bonafide/staff/pending
// @access  Private (Admission Staff)
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await BonafideRequest.find({ status: 'pending' })
      .populate({
        path: 'studentId',
        select: 'personalDetails.fullName studentId academicProfile.course academicProfile.currentSemester'
      })
      .sort({ createdAt: 1 });

    const augmented = await augmentRequests(requests);
    res.status(200).json({ success: true, data: augmented });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all processed bonafide requests (approved or rejected)
// @route   GET /api/academic/bonafide/staff/processed
// @access  Private (Admission Staff)
exports.getProcessedRequests = async (req, res) => {
  try {
    const requests = await BonafideRequest.find({ status: { $ne: 'pending' } })
      .populate({
        path: 'studentId',
        select: 'personalDetails.fullName studentId academicProfile.course academicProfile.currentSemester'
      })
      .populate({
        path: 'approvedBy',
        select: 'fullName designation'
      })
      .sort({ updatedAt: -1 });

    const augmented = await augmentRequests(requests);
    res.status(200).json({ success: true, data: augmented });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Approve a bonafide request
// @route   POST /api/academic/bonafide/staff/approve/:id
// @access  Private (Admission Staff)
exports.approveRequest = async (req, res) => {
  try {
    const request = await BonafideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Request has already been processed' });
    }

    // Generate unique certificate number
    const count = await BonafideRequest.countDocuments({ status: 'approved' });
    const certificateNumber = `BONA-${new Date().getFullYear()}-${10000 + count + 1}`;

    request.status = 'approved';
    request.certificateNumber = certificateNumber;
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();

    await request.save();

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Reject a bonafide request
// @route   POST /api/academic/bonafide/staff/reject/:id
// @access  Private (Admission Staff)
exports.rejectRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ success: false, error: 'Please provide a reason for rejection' });
    }

    const request = await BonafideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Request has already been processed' });
    }

    request.status = 'rejected';
    request.rejectionReason = rejectionReason;
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();

    await request.save();

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
