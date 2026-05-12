const express = require('express');
const {
  getMyMasterProfile,
  getAllStudents,
  getStudentById,
  updateStudentMaster
} = require('../../controllers/student-master/studentMasterController');

const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

// ==================================
// STUDENT ROUTES
// ==================================
// This endpoint implicitly accesses data through JWT (req.user.id)
router.route('/me').get(protect, authorize('student'), getMyMasterProfile);

// ==================================
// STAFF & ADMIN ROUTES
// ==================================
router.route('/')
  .get(protect, authorize('admission_staff', 'library_staff', 'hostel_staff', 'super_admin'), getAllStudents);

router.route('/:id')
  .get(protect, authorize('admission_staff', 'library_staff', 'hostel_staff', 'super_admin'), getStudentById)
  .put(protect, authorize('admission_staff', 'super_admin'), updateStudentMaster);

module.exports = router;
