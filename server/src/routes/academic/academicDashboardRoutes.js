const express = require('express');
const router = express.Router();
const academicDashboardController = require('../../controllers/academic/academicDashboardController');
const { protect } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.get('/stats', academicDashboardController.getAcademicDashboard);
router.get('/actions', academicDashboardController.getQuickActions);

module.exports = router;
