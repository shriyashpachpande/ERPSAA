const enrollmentService = require('../../services/academic/studentSemesterEnrollmentService');
const StudentMaster = require('../../models/student-master/StudentMaster');

exports.getEligibleStudents = async (req, res) => {
  try {
    const students = await enrollmentService.getEligibleStudents(req.query, req.user);
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const enrollment = await enrollmentService.enrollStudent(req.body, req.user.id);
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Student is already enrolled for this semester' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getEnrollments(req.query, req.user);
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await enrollmentService.getEnrollmentById(req.params.id, req.user);
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(error.message.includes('Access denied') ? 403 : 500).json({ success: false, error: error.message });
  }
};

exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await enrollmentService.updateEnrollment(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    let studentId = req.params.studentId || req.user?.studentProfileId;
    
    // Explicit guard against "undefined" string sent from frontend or missing profile
    if (studentId === 'undefined' || !studentId) {
      if (req.user) {
        const profile = await StudentMaster.findOne({ userId: req.user.id });
        if (profile) studentId = profile._id;
      }
    }
    
    if (!studentId || studentId === 'undefined') {
      return res.status(400).json({ success: false, error: 'Student profile not identified' });
    }

    const profile = await enrollmentService.getStudentAcademicProfile(studentId, req.user);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid Student ID format' });
    }
    res.status(error.message.includes('Access denied') ? 403 : 500).json({ success: false, error: error.message });
  }
};
