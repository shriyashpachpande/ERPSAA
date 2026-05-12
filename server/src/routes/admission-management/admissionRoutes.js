const express = require('express');
const {
  getOwnApplication,
  createOrUpdateDraft,
  submitApplication,
  reuploadDocuments,
  getAllApplications,
  getApplicationById,
  reviewApplication,
  requestReupload,
  rejectApplication,
  approveApplication,
  createApplicantAccount,
  getReviewQueueStats
} = require('../../controllers/admission-management/admissionController');
const { 
  getDashboardStats,
  getDashboardTrend,
  getDashboardRecent,
  getDashboardActivity,
  getDashboardFunnel
} = require('../../controllers/admission-management/admissionDashboardController');

const { protect, authorize } = require('../../middlewares/auth/authMiddleware');
const { uploadAdmissionDocs } = require('../../middlewares/upload/uploadMiddleware');

const router = express.Router();

// ==================================
// STUDENT ROUTES
// ==================================
router.route('/me').get(protect, authorize('student'), getOwnApplication);

// POST / and PUT /draft go through multer so files are handled
router.route('/')
  .post(protect, authorize('student'), uploadAdmissionDocs, createOrUpdateDraft)
  .get(protect, authorize('admission_staff', 'super_admin'), getAllApplications);

router.route('/draft').put(protect, authorize('student'), uploadAdmissionDocs, createOrUpdateDraft);
router.route('/submit').post(protect, authorize('student'), submitApplication);
router.route('/reupload').put(protect, authorize('student'), uploadAdmissionDocs, reuploadDocuments);

// ==================================
// STAFF & SUPER ADMIN ROUTES
// ==================================
router.get('/dashboard/stats', protect, authorize('admission_staff', 'super_admin'), getDashboardStats);
router.get('/dashboard/trend', protect, authorize('admission_staff', 'super_admin'), getDashboardTrend);
router.get('/dashboard/recent', protect, authorize('admission_staff', 'super_admin'), getDashboardRecent);
router.get('/dashboard/activity', protect, authorize('admission_staff', 'super_admin'), getDashboardActivity);
router.get('/dashboard/funnel', protect, authorize('admission_staff', 'super_admin'), getDashboardFunnel);

router.route('/create-applicant')
  .post(protect, authorize('admission_staff', 'super_admin'), createApplicantAccount);

router.route('/queue-stats')
  .get(protect, authorize('admission_staff', 'super_admin'), getReviewQueueStats);

router.route('/:id')
  .get(protect, authorize('admission_staff', 'super_admin'), getApplicationById);

router.route('/:id/review')
  .put(protect, authorize('admission_staff', 'super_admin'), reviewApplication);

router.route('/:id/request-reupload')
  .put(protect, authorize('admission_staff', 'super_admin'), requestReupload);

router.route('/:id/reject')
  .put(protect, authorize('admission_staff', 'super_admin'), rejectApplication);

router.route('/:id/approve')
  .put(protect, authorize('admission_staff', 'super_admin'), approveApplication);

module.exports = router;
