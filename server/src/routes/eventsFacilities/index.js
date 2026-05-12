const express = require('express');

const catalogRoutes = require('./facilityCatalog.events.routes');
const bookingRoutes = require('./facilityBooking.events.routes');
const approvalRoutes = require('./facilityApproval.events.routes');
const adminRoutes = require('./facilityAdmin.events.routes');

const router = express.Router();

router.use('/catalog', catalogRoutes);
router.use('/bookings', bookingRoutes);
router.use('/management', approvalRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
