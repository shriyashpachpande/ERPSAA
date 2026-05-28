const StudentMaster = require('../../models/student-master/StudentMaster');
const StudentSemesterEnrollment = require('../../models/academic/StudentSemesterEnrollment');

// @desc    Get current student's own master profile
// @route   GET /api/student-master/me
// @access  Private/Student
exports.getMyMasterProfile = async (req, res) => {
  try {
    // Rely exclusively on JWT req.user.id, ZERO manual ID entry needed.
    const profile = await StudentMaster.findOne({ userId: req.user.id })
      .populate('userId', 'fullName email')
      .populate('admissionId')
      .populate('history.changedBy', 'fullName role');

    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: 'STUDENT_MASTER_NOT_FOUND',
        message: 'Student master record not found. Please ensure admission is approved.' 
      });
    }

    // Fetch latest enrollment context for Semester/Year display
    const currentEnrollment = await StudentSemesterEnrollment.findOne({ studentMasterId: profile._id })
      .populate('academicYearId', 'name')
      .populate('semesterId', 'semesterName semesterNumber')
      .populate({
        path: 'sectionId',
        populate: {
          path: 'mentorFacultyId',
          populate: {
            path: 'user',
            select: 'fullName email'
          }
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: {
        ...profile.toObject(),
        currentEnrollment
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all student master records
// @route   GET /api/student-master
// @access  Private/Admin/Staff
exports.getAllStudents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.enrollmentStatus = req.query.status;
    if (req.query.department) filter['academicProfile.department'] = req.query.department;
    if (req.query.course) filter['academicProfile.course'] = req.query.course;

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { studentId: regex },
        { 'personalDetails.fullName': regex },
        { 'contactDetails.email': regex }
      ];
    }

    const sort = req.query.sort === 'oldest' ? 'createdAt' : '-createdAt';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await StudentMaster.find(filter)
      .populate('userId', 'email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await StudentMaster.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: students
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single student master record by ID
// @route   GET /api/student-master/:id
// @access  Private/Admin/Staff
exports.getStudentById = async (req, res) => {
  try {
    const student = await StudentMaster.findById(req.params.id)
      .populate('userId', 'fullName email')
      .populate('admissionId', 'applicationId courseSelection uploadedDocuments')
      .populate('history.changedBy', 'fullName role');

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student record not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update student master record modules
// @route   PUT /api/student-master/:id
// @access  Private/Admin/Staff
exports.updateStudentMaster = async (req, res) => {
  try {
    const { enrollmentStatus, academicProfile, modules, note } = req.body;
    const student = await StudentMaster.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student record not found' });
    }

    if (enrollmentStatus) student.enrollmentStatus = enrollmentStatus;
    
    // Merge academic updates
    if (academicProfile) {
      student.academicProfile = { ...student.academicProfile.toObject(), ...academicProfile };
    }

    // Merge module status updates
    if (modules) {
      // e.g. { fees: { status: 'paid' } }
      const allowedModules = ['fees', 'hostel', 'library', 'attendance', 'complaints'];
      allowedModules.forEach(mod => {
        if (modules[mod]) {
          student.modules[mod] = { ...student.modules[mod].toObject(), ...modules[mod] };
        }
      });
    }

    // Add Audit Log
    student.history.push({
      action: 'RECORD_UPDATED',
      changedBy: req.user.id,
      details: { note: note || 'Administrative update to master record' }
    });

    await student.save();

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
