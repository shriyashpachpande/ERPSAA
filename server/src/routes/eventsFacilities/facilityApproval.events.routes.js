const express = require('express');
const { 
  getPendingRequests, 
  approveBooking, 
  rejectBooking,
  getFacilitySchedule,
  getConflicts
} = require('../../controllers/eventsFacilities/facilityApproval.events.controller');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

// Only sport teachers or admins can approve/reject
router.use(protect);
router.use(authorize('sport_teacher', 'admin', 'super_admin'));

router.get('/requests', getPendingRequests);
router.get('/schedule', getFacilitySchedule);
router.get('/conflicts', getConflicts);
router.put('/requests/:id/approve', approveBooking);
router.put('/requests/:id/reject', rejectBooking);

module.exports = router;
