const express = require('express');
const router = express.Router();
const { 
  createMapping, 
  bulkCreateMapping, 
  getAllMappings, 
  deleteMapping 
} = require('../../controllers/academic/semesterSubjectMappingController');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.post('/', authorize('super_admin', 'academic_admin'), createMapping);
router.post('/bulk', authorize('super_admin', 'academic_admin'), bulkCreateMapping);
router.get('/', getAllMappings);
router.delete('/:id', authorize('super_admin', 'academic_admin'), deleteMapping);

module.exports = router;
