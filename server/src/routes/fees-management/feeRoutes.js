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
    getAccountsReportsSummary
} = require('../../controllers/fees-management/feeController');
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');

// Student Routes
router.get('/my-fees', protect, authorize('student'), getMyFees);
router.get('/my-receipts', protect, authorize('student'), getMyReceipts);
router.get('/my-receipts/:receiptId', protect, getReceiptDetail);

// Staff & Admin Routes
router.use(protect, authorize('staff_account', 'accounts_staff', 'super_admin'));

router.get('/staff/dashboard', getFeeDashboard);
router.get('/staff/dashboard/enhanced', getEnhancedFeeDashboard);
router.get('/staff/students', searchStudentFees);
router.get('/staff/students/:id', getStudentFeeDetail);
router.post('/staff/payments', addPayment);
router.get('/staff/fee-structures', getFeeStructures);
router.put('/staff/fee-structures/:id', updateFeeStructure);
router.delete('/staff/fee-structures/:id', deleteFeeStructure);
router.post('/staff/students/:studentMasterId/init-account', initStudentFeeAccount);
router.get('/staff/fee-structures/:id/analysis', getFeeStructureImpactAnalysis);
router.get('/staff/reports/accounts-summary', getAccountsReportsSummary);

module.exports = router;
