const express = require('express');
const router = express.Router();
const { 
    getMyFees, 
    getMyReceipts, 
    getFeeDashboard, 
    searchStudentFees,
    getStudentFeeDetail, 
    addPayment,
    getReceiptDetail,
    getFeeStructures,
    updateFeeStructure,
    deleteFeeStructure,
    initStudentFeeAccount,
    getEnhancedFeeDashboard,
    getFeeStructureImpactAnalysis,
    getAccountsReportsSummary,
    submitPaymentRequest,
    getPaymentRequests,
    getStudentPaymentRequests,
    approvePaymentRequest,
    rejectPaymentRequest
} = require('../../controllers/fees-management/feeController');
const { createCheckoutSession, verifyCheckoutSession } = require('../../controllers/fees-management/stripeController');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

// Student Routes
router.get('/my-fees', protect, authorize('student'), getMyFees);
router.post('/my-fees/payment-request', protect, authorize('student'), submitPaymentRequest);
router.post('/payments/create-checkout-session', protect, authorize('student'), createCheckoutSession);
router.post('/payments/verify-checkout-session', protect, authorize('student'), verifyCheckoutSession);
router.get('/my-receipts', protect, authorize('student'), getMyReceipts);
router.get('/my-receipts/:receiptId', protect, getReceiptDetail);

// Staff & Admin Routes
const staffAuth = [protect, authorize('staff_account', 'accounts_staff', 'super_admin')];

router.get('/staff/dashboard', staffAuth, getFeeDashboard);
router.get('/staff/dashboard/enhanced', staffAuth, getEnhancedFeeDashboard);
router.get('/staff/students', staffAuth, searchStudentFees);
router.get('/staff/students/:id', staffAuth, getStudentFeeDetail);
router.get('/staff/payment-requests', staffAuth, getPaymentRequests);
router.get('/staff/students/:id/payment-requests', staffAuth, getStudentPaymentRequests);
router.post('/staff/payment-requests/:id/approve', staffAuth, approvePaymentRequest);
router.post('/staff/payment-requests/:id/reject', staffAuth, rejectPaymentRequest);
router.post('/staff/payments', staffAuth, addPayment);
router.get('/staff/fee-structures', staffAuth, getFeeStructures);
router.put('/staff/fee-structures/:id', staffAuth, updateFeeStructure);
router.delete('/staff/fee-structures/:id', staffAuth, deleteFeeStructure);
router.post('/staff/students/:studentMasterId/init-account', staffAuth, initStudentFeeAccount);
router.get('/staff/fee-structures/:id/analysis', staffAuth, getFeeStructureImpactAnalysis);
router.get('/staff/reports/accounts-summary', staffAuth, getAccountsReportsSummary);

module.exports = router;
