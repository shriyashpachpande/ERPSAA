const express = require('express');
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  approveBooking,
  rejectBooking
} = require('../../controllers/events/eventController');

const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

// STUDENT ROUTES
router.post('/book', protect, authorize('student'), createBooking);
router.get('/my-requests', protect, authorize('student'), getMyBookings);
router.post('/cancel/:id', protect, authorize('student'), cancelBooking);

// SPORT TEACHER / ADMIN ROUTES
router.get('/all', protect, authorize('sport_teacher', 'super_admin'), getAllBookings);
router.put('/approve/:id', protect, authorize('sport_teacher', 'super_admin'), approveBooking);
router.put('/reject/:id', protect, authorize('sport_teacher', 'super_admin'), rejectBooking);

module.exports = router;
