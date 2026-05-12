const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

const {
  applyForHostel,
  getMyApplication,
  getAllApplications,
  updateApplicationStatus
} = require('../../controllers/hostel-management/hostelApplication.controller');

const {
  allocateBed,
  vacateBed,
  getMyRoom
} = require('../../controllers/hostel-management/hostelAllocation.controller');

const {
  getDashboardStats
} = require('../../controllers/hostel-management/hostelDashboard.controller');

const {
  getHostelOccupancy,
  getHostelsSummary
} = require('../../controllers/hostel-management/hostelOccupancy.controller');

const {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus
} = require('../../controllers/hostel-management/hostelComplaint.controller');

const {
  submitRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus
} = require('../../controllers/hostel-management/hostelMaintenance.controller');

const {
  checkIn,
  checkOut,
  getStudentLogs,
  getCheckInOutStats,
  getStudentHostelProfile
} = require('../../controllers/hostel-management/hostelCheckIn.controller');

// ─── Student Routes ──────────────────────────────────────────────────────────
router.post('/apply', protect, authorize('student'), applyForHostel);
router.get('/my-application', protect, authorize('student'), getMyApplication);
router.get('/my-room', protect, authorize('student'), getMyRoom);
router.post('/complaints', protect, authorize('student'), submitComplaint);
router.get('/my-complaints', protect, authorize('student'), getMyComplaints);
router.post('/maintenance', protect, authorize('student'), submitRequest);
router.get('/my-requests', protect, authorize('student'), getMyRequests);

// ─── Hostel Staff Routes ─────────────────────────────────────────────────────
router.get('/staff/dashboard', protect, authorize('hostel_staff', 'super_admin'), getDashboardStats);
router.get('/staff/applications', protect, authorize('hostel_staff', 'super_admin'), getAllApplications);
router.put('/staff/applications/:id/status', protect, authorize('hostel_staff', 'super_admin'), updateApplicationStatus);
router.post('/staff/allocate', protect, authorize('hostel_staff', 'super_admin'), allocateBed);
router.put('/staff/vacate/:id', protect, authorize('hostel_staff', 'super_admin'), vacateBed);
router.get('/staff/occupancy/:hostelId', protect, authorize('hostel_staff', 'super_admin'), getHostelOccupancy);
router.get('/staff/hostels-summary', protect, authorize('hostel_staff', 'super_admin'), getHostelsSummary);
router.get('/staff/complaints', protect, authorize('hostel_staff', 'super_admin'), getAllComplaints);
router.put('/staff/complaints/:id', protect, authorize('hostel_staff', 'super_admin'), updateComplaintStatus);
router.get('/staff/requests', protect, authorize('hostel_staff', 'super_admin'), getAllRequests);
router.put('/staff/requests/:id', protect, authorize('hostel_staff', 'super_admin'), updateRequestStatus);
router.post('/staff/check-in', protect, authorize('hostel_staff', 'super_admin'), checkIn);
router.post('/staff/check-out', protect, authorize('hostel_staff', 'super_admin'), checkOut);
router.get('/staff/check-in-out/stats', protect, authorize('hostel_staff', 'super_admin'), getCheckInOutStats);
router.get('/staff/student-profile/:studentId', protect, authorize('hostel_staff', 'super_admin'), getStudentHostelProfile);
router.get('/staff/logs/:studentId', protect, authorize('hostel_staff', 'super_admin'), getStudentLogs);

module.exports = router;
