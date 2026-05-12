const express = require('express');
const router = express.Router();
const { 
  createEntry, 
  getEntries, 
  getEntry, 
  updateEntry, 
  deleteEntry, 
  getSectionTimetable, 
  getFacultyTimetable 
} = require('../../controllers/academic/timetableManagementController');
const { protect } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.post('/', createEntry);
router.get('/', getEntries);
router.get('/my-timetable', getFacultyTimetable);
router.get('/section/:sectionId', getSectionTimetable);
router.get('/faculty/:facultyProfileId', getFacultyTimetable);
router.get('/:id', getEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;
