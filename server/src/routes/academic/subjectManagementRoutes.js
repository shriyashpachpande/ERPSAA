const express = require('express');
const router = express.Router();
const { 
  createSubject, 
  getAllSubjects, 
  getSubject, 
  updateSubject, 
  updateStatus 
} = require('../../controllers/academic/subjectController');
const { protect } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.post('/', createSubject);
router.get('/', getAllSubjects);
router.get('/:id', getSubject);
router.put('/:id', updateSubject);
router.patch('/:id/status', updateStatus);

module.exports = router;
