const express = require('express');
const {
    reportIncident,
    getIncidents,
    updateIncidentStatus
} = require('./healthController');

const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

router.post('/report', protect, authorize('faculty', 'hod', 'admin', 'super_admin', 'academic_admin'), reportIncident);
router.get('/', protect, authorize('faculty', 'hod', 'admin', 'super_admin', 'academic_admin'), getIncidents);
router.put('/:id', protect, authorize('faculty', 'hod', 'admin', 'super_admin', 'academic_admin'), updateIncidentStatus);

module.exports = router;
