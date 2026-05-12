const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../../../../middlewares/auth/authMiddleware');

router.use(protect);

router.get('/subjects', attendanceController.getSubjects);
router.get('/students', attendanceController.getStudents);
router.post('/mark', authorize('admin', 'faculty', 'hod'), attendanceController.markAttendance);
router.get('/my-stats', authorize('student'), attendanceController.getStudentStats);
router.get('/sessions', authorize('admin', 'hod', 'faculty'), attendanceController.getSessions);
router.get('/student-stats/:studentMasterId', authorize('admin', 'hod', 'faculty'), attendanceController.getStudentStats);

module.exports = router;
