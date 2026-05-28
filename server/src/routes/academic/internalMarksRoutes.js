const express = require('express');
const router = express.Router();
const internalMarksController = require('../../controllers/academic/internalMarksController');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.route('/')
  .get(authorize('super_admin', 'academic_admin', 'hod', 'faculty'), internalMarksController.getMarks)
  .post(authorize('super_admin', 'academic_admin', 'hod', 'faculty'), internalMarksController.saveMarks);

router.get('/my-marks', authorize('student'), internalMarksController.getMyMarks);

module.exports = router;
