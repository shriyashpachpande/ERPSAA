const express = require('express');
const { createBooking, getMyBookings } = require('../../controllers/eventsFacilities/facilityBooking.events.controller');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

// Only students can book
router.post('/', protect, authorize('student'), createBooking);
router.get('/my-bookings', protect, authorize('student'), getMyBookings);

module.exports = router;
