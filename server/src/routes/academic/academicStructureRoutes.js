const express = require('express');
const router = express.Router();
const { 
  createAcademicYear, 
  getAllAcademicYears, 
  getAcademicYear, 
  updateAcademicYear, 
  setCurrent, 
  updateStatus 
} = require('../../controllers/academic/academicYearController');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

// @route   GET /api/academic/structure/years
router.get('/years', getAllAcademicYears);

// @route   GET /api/academic/structure/years/:id
router.get('/years/:id', getAcademicYear);

// @route   POST /api/academic/structure/years
router.post('/years', authorize('super_admin', 'academic_admin'), createAcademicYear);

// @route   PUT /api/academic/structure/years/:id
router.put('/years/:id', authorize('super_admin', 'academic_admin'), updateAcademicYear);

// @route   PATCH /api/academic/structure/years/:id/set-current
router.patch('/years/:id/set-current', authorize('super_admin', 'academic_admin'), setCurrent);

// @route   PATCH /api/academic/structure/years/:id/status
router.patch('/years/:id/status', authorize('super_admin', 'academic_admin'), updateStatus);

module.exports = router;
