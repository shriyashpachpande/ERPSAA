const express = require('express');
const { getAllFacilities, updateFacilityStatus } = require('../../controllers/eventsFacilities/facilityAdmin.events.controller');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/facilities', getAllFacilities);
router.put('/facilities/:id/status', updateFacilityStatus);

module.exports = router;
