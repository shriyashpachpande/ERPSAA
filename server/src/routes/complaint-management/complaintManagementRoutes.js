const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Middlewares
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');
const complaintAccessGuard = require('../../middlewares/complaint-management/complaintAccessGuardMiddleware');
const complaintVisibilityGuard = require('../../middlewares/complaint-management/complaintVisibilityGuardMiddleware');
const checkComplaintPermission = require('../../middlewares/complaint-management/complaintPermissionCheckMiddleware');

// Controllers - Student
const createStudentComplaint = require('../../controllers/complaint-management/createStudentComplaintController');
const getStudentOwnComplaintList = require('../../controllers/complaint-management/getStudentOwnComplaintListController');
const getStudentComplaintStatusList = require('../../controllers/complaint-management/getStudentComplaintStatusListController');

// Controllers - Shared/Details
const getComplaintDetailsById = require('../../controllers/complaint-management/getComplaintDetailsByIdController');
const getComplaintConversationTimeline = require('../../controllers/complaint-management/getComplaintConversationTimelineController');
const addComplaintConversationMessage = require('../../controllers/complaint-management/addComplaintConversationMessageController');

// Controllers - Handler
const getAssignedComplaintQueue = require('../../controllers/complaint-management/getAssignedComplaintQueueController');
const getDepartmentComplaintQueue = require('../../controllers/complaint-management/getDepartmentComplaintQueueController');
const assignComplaintToHandler = require('../../controllers/complaint-management/assignComplaintToHandlerController');
const updateComplaintWorkflowStatus = require('../../controllers/complaint-management/updateComplaintWorkflowStatusController');
const resolveComplaintTicket = require('../../controllers/complaint-management/resolveComplaintTicketController');
const rejectComplaintTicket = require('../../controllers/complaint-management/rejectComplaintTicketController');
const escalateOverdueComplaint = require('../../controllers/complaint-management/escalateOverdueComplaintController');

// Controllers - Finalization
const reopenResolvedComplaint = require('../../controllers/complaint-management/reopenResolvedComplaintController');
const closeComplaintAfterFeedback = require('../../controllers/complaint-management/closeComplaintAfterFeedbackController');
const submitComplaintResolutionFeedback = require('../../controllers/complaint-management/submitComplaintResolutionFeedbackController');
const getComplaintAnalyticsSummary = require('../../controllers/complaint-management/getComplaintAnalyticsSummaryController');

// ─── MULTER CONFIG FOR COMPLAINTS ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../../uploads/complaint-evidence');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `complaint-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Define Routes
router.use(protect);

// Student Routes
router.post('/create', authorize('student'), upload.single('evidence'), createStudentComplaint);
router.get('/my-list', authorize('student'), getStudentOwnComplaintList);
router.get('/my-status', authorize('student'), getStudentComplaintStatusList);
router.put('/reopen/:id', authorize('student'), complaintAccessGuard, reopenResolvedComplaint);
router.post('/submit-feedback/:id', authorize('student'), complaintAccessGuard, submitComplaintResolutionFeedback);

// Common Detail Routes (Protected by Access Guard)
router.get('/details/:id', complaintAccessGuard, complaintVisibilityGuard, getComplaintDetailsById);
router.get('/timeline/:id', complaintAccessGuard, getComplaintConversationTimeline);
router.post('/add-message/:id', complaintAccessGuard, addComplaintConversationMessage);

// Handler Routes
router.get('/assigned-queue', authorize('faculty', 'hod', 'librarian', 'library_staff', 'accounts_staff', 'staff_account', 'super_admin', 'admin'), getAssignedComplaintQueue);
router.get('/department-queue', authorize('faculty', 'hod', 'librarian', 'library_staff', 'accounts_staff', 'staff_account', 'super_admin'), getDepartmentComplaintQueue);
router.put('/update-status/:id', complaintAccessGuard, updateComplaintWorkflowStatus);
router.put('/resolve/:id', complaintAccessGuard, resolveComplaintTicket);
router.put('/reject/:id', complaintAccessGuard, rejectComplaintTicket);
router.put('/escalate/:id', complaintAccessGuard, escalateOverdueComplaint);

// Admin / HOD Actions
router.put('/assign-handler/:id', authorize('super_admin', 'admin', 'hod', 'academic_admin'), assignComplaintToHandler);
router.get('/analytics-summary', authorize('super_admin', 'admin', 'hod', 'academic_admin'), getComplaintAnalyticsSummary);

// Closing (Shared)
router.put('/close/:id', complaintAccessGuard, closeComplaintAfterFeedback);

module.exports = router;
