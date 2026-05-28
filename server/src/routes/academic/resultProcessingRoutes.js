const express = require('express');
const router = express.Router();
const resultProcessingController = require('../../controllers/academic/resultProcessingController');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.post('/generate', authorize('super_admin', 'academic_admin', 'hod'), resultProcessingController.generateResults);
router.post('/publish', authorize('super_admin', 'academic_admin', 'hod'), resultProcessingController.publishResults);
router.get('/', authorize('super_admin', 'academic_admin', 'hod', 'faculty', 'student'), resultProcessingController.getResults);

module.exports = router;
