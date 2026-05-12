const express = require('express');
const router = express.Router();
const { 
  getEligibleStudents, 
  enrollStudent, 
  getEnrollments, 
  getEnrollmentById,
  updateEnrollment, 
  getStudentProfile 
} = require('../../controllers/academic/studentSemesterEnrollmentController');
const { protect } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.get('/eligible-students', getEligibleStudents);
router.get('/my-profile', getStudentProfile);
router.get('/profile/:studentId', getStudentProfile);
router.post('/enroll', enrollStudent);
router.get('/', getEnrollments);
router.get('/:id', getEnrollmentById);
router.put('/:id', updateEnrollment);

module.exports = router;
