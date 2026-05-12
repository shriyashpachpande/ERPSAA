const express = require('express');
const { getCategories, getFacilities, getFacilitiesByCategory, getFacilityBySlug } = require('../../controllers/eventsFacilities/facilityCatalog.events.controller');
const { protect } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

router.get('/categories', protect, getCategories);
router.get('/facilities', protect, getFacilities);
router.get('/categories/:categorySlug/facilities', protect, getFacilitiesByCategory);
router.get('/facilities/:facilitySlug', protect, getFacilityBySlug);

module.exports = router;
