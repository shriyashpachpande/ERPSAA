const express = require('express');
const router = express.Router();
const { 
  createSemester, 
  getAllSemesters, 
  getSemester, 
  updateSemester, 
  updateStatus 
} = require('../../controllers/academic/semesterController');
const { protect } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.post('/', createSemester);
router.get('/', getAllSemesters);
router.get('/:id', getSemester);
router.put('/:id', updateSemester);
router.patch('/:id/status', updateStatus);

module.exports = router;
