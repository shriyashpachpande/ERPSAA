const express = require('express');
const router = express.Router();
const { getStudentDashboardData } = require('../../controllers/dashboard/studentDashboard.controller');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

router.get('/student', protect, authorize('student'), getStudentDashboardData);

module.exports = router;
