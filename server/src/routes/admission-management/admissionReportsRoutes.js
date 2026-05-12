const express = require('express');
const router = express.Router();
const { 
  getReportsOverview, 
  getStatusBreakdown, 
  getDepartmentBreakdown, 
  getMonthlyTrends 
} = require('../../controllers/admission-management/admissionReportsController');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

router.use(protect);
router.use(authorize('super_admin', 'admission_staff'));

router.get('/overview', getReportsOverview);
router.get('/status-breakdown', getStatusBreakdown);
router.get('/department-breakdown', getDepartmentBreakdown);
router.get('/monthly-trends', getMonthlyTrends);

module.exports = router;
