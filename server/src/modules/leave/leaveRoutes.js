const express = require('express');
const {
    createLeaveRequest,
    getStudentLeaves,
    getAllLeaveRequests,
    updateLeaveStatus,
    getLeaveBalance
} = require('./leaveController');
const { getAnalytics } = require('./analyticsController');

const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

router.post('/apply', protect, authorize('student'), createLeaveRequest);
router.get('/student', protect, authorize('student'), getStudentLeaves);
router.get('/balance', protect, authorize('student'), getLeaveBalance);
router.get('/all', protect, authorize('faculty', 'hod', 'admin', 'super_admin', 'academic_admin'), getAllLeaveRequests);
router.put('/status', protect, authorize('faculty', 'hod', 'admin', 'super_admin', 'academic_admin'), updateLeaveStatus);
router.get('/analytics', protect, authorize('hod', 'admin', 'super_admin', 'academic_admin'), getAnalytics);

module.exports = router;
