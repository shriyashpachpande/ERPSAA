const express = require('express');
const router = express.Router();
const {
  requestBonafide,
  getMyBonafideRequests,
  getPendingRequests,
  getProcessedRequests,
  approveRequest,
  rejectRequest
} = require('../../controllers/academic/bonafideController');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

// Student Routes
router.post('/request', protect, authorize('student'), requestBonafide);
router.get('/my-requests', protect, authorize('student'), getMyBonafideRequests);

// Admission Staff Specific Routes (strictly admission_staff role)
router.get('/staff/pending', protect, authorize('admission_staff'), getPendingRequests);
router.get('/staff/processed', protect, authorize('admission_staff'), getProcessedRequests);
router.post('/staff/approve/:id', protect, authorize('admission_staff'), approveRequest);
router.post('/staff/reject/:id', protect, authorize('admission_staff'), rejectRequest);

module.exports = router;
