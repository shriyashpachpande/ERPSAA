const express = require('express');
const router = express.Router();
const { 
  createSection, 
  getAllSections, 
  getSection, 
  updateSection, 
  updateStatus,
  getMyMentoredSections
} = require('../../controllers/academic/sectionManagementController');
const { protect } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.post('/', createSection);
router.get('/', getAllSections);
router.get('/me/mentored', getMyMentoredSections);
router.get('/:id', getSection);
router.put('/:id', updateSection);
router.patch('/:id/status', updateStatus);

module.exports = router;
