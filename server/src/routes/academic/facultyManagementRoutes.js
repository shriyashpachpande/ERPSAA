const express = require('express');
const router = express.Router();
const { 
  createFaculty, 
  getFacultyList, 
  getFacultyDetail, 
  toggleStatus,
  deleteFaculty
} = require('../../controllers/academic/facultyManagementController');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

// @route   POST /api/academic/faculty
// @access  Private (Academic Admin, Super Admin)
router.post('/', protect, createFaculty);

// @route   GET /api/academic/faculty
// @access  Private (Academic Admin, HOD, Super Admin)
router.get('/', protect, getFacultyList);

// @route   GET /api/academic/faculty/:id
// @access  Private (Self or Admin)
router.get('/:id', protect, getFacultyDetail);

// @route   PATCH /api/academic/faculty/:id/status
// @access  Private (Academic Admin, Super Admin)
router.patch('/:id/status', protect, authorize('super_admin', 'academic_admin'), toggleStatus);

// @route   DELETE /api/academic/faculty/:id
// @access  Private (Academic Admin, Super Admin)
router.delete('/:id', protect, authorize('super_admin', 'academic_admin'), deleteFaculty);

module.exports = router;
