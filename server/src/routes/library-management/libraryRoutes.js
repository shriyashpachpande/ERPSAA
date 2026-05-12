const express = require('express');
const router = express.Router();
const bookController = require('../../controllers/library-management/book.controller');
const bookCopyController = require('../../controllers/library-management/bookCopy.controller');
const issueController = require('../../controllers/library-management/issue.controller');
const statsController = require('../../controllers/library-management/stats.controller');
const fineController = require('../../controllers/library-management/fine.controller');
const policyController = require('../../controllers/library-management/policy.controller');
const reservationController = require('../../controllers/library-management/reservation.controller');
const notificationController = require('../../controllers/library-management/notification.controller');
const bookCopyStatusController = require('../../controllers/library-management/bookCopyStatus.controller');
const bookRequestController = require('../../controllers/library-management/bookRequest.controller');
const issueRequestController = require('../../controllers/library-management/issueRequest.controller');
const analyticsController = require('../../controllers/library-management/analytics.controller');
const auditController = require('../../controllers/library-management/audit.controller');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

// Books Routes
router.route('/books')
    .get(protect, bookController.getBooks)
    .post(protect, authorize('super_admin', 'library_staff'), bookController.createBook);

router.route('/books/:id')
    .get(protect, bookController.getBook)
    .put(protect, authorize('super_admin', 'library_staff'), bookController.updateBook)
    .delete(protect, authorize('super_admin', 'library_staff'), bookController.deleteBook);

// Book Copies Routes
router.route('/books/:id/copies')
    .get(protect, bookCopyController.getCopies)
    .post(protect, authorize('super_admin', 'library_staff'), bookCopyController.createCopy);

// Issue/Return Routes
router.post('/issue', protect, authorize('super_admin', 'library_staff'), issueController.issueBook);
router.post('/return', protect, authorize('super_admin', 'library_staff'), issueController.returnBook);
router.get('/issued-books', protect, authorize('super_admin', 'library_staff'), issueController.getIssuedBooks);
router.get('/student/:studentId/books', protect, issueController.getStudentBooks);
router.get('/stats', protect, statsController.getLibraryStats);

// Phase 2: Fines
router.get('/fines', protect, authorize('super_admin', 'library_staff'), fineController.getAllFines);
router.get('/fines/student/:studentId', protect, fineController.getStudentFines);
router.post('/fines/collect', protect, authorize('super_admin', 'library_staff'), fineController.collectPayment);
router.post('/fines/waive', protect, authorize('super_admin'), fineController.waiveFine);

// Phase 2: Policies
router.get('/policies/active', protect, policyController.getActivePolicy);
router.get('/policies', protect, authorize('super_admin'), policyController.getAllPolicies);
router.put('/policies/:id', protect, authorize('super_admin'), policyController.updatePolicy);

// Phase 2: Reservations
router.post('/reservations', protect, reservationController.createReservation);
router.get('/reservations/student/:studentId', protect, reservationController.getStudentReservations);
router.get('/reservations/book/:bookId', protect, reservationController.getBookReservations);
router.delete('/reservations/:id', protect, reservationController.cancelReservation);

// Phase 2: Notifications
router.get('/notifications/student/:studentId', protect, notificationController.getStudentNotifications);
router.post('/notifications/:id/read', protect, notificationController.markAsRead);
router.post('/notifications/trigger-reminders', protect, authorize('super_admin', 'library_staff'), notificationController.triggerReminders);

// Phase 2: Lost/Damaged
router.post('/copies/:copyId/mark-lost', protect, authorize('super_admin', 'library_staff'), bookCopyStatusController.markAsLost);
router.post('/copies/:copyId/mark-damaged', protect, authorize('super_admin', 'library_staff'), bookCopyStatusController.markAsDamaged);

// Phase 2: Book Requests (Suggestions)
router.post('/book-requests', protect, bookRequestController.createRequest);
router.get('/book-requests/student/:studentId', protect, bookRequestController.getStudentRequests);
router.get('/book-requests', protect, authorize('super_admin', 'library_staff'), bookRequestController.getAllRequests);
router.put('/book-requests/:id/review', protect, authorize('super_admin', 'library_staff'), bookRequestController.reviewRequest);

// Issue Requests (Student Borrow Requests)
router.post('/issue-requests', protect, issueRequestController.createRequest);
router.get('/issue-requests/student/:studentId', protect, issueRequestController.getStudentRequests);
router.get('/issue-requests', protect, authorize('super_admin', 'library_staff'), issueRequestController.getAllRequests);
router.put('/issue-requests/:id/review', protect, authorize('super_admin', 'library_staff'), issueRequestController.reviewRequest);

// Phase 2: Analytics
router.get('/analytics/advanced', protect, authorize('super_admin', 'library_staff'), analyticsController.getAdvancedAnalytics);

// Phase 2: Audit Logs
router.get('/audit-logs', protect, authorize('super_admin'), auditController.getLogs);

module.exports = router;
