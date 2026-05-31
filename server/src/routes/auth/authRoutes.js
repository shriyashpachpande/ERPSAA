const express = require('express'); // <--- Add this line
const { loginUser, forgotPassword, getMe, updateDetails, updatePassword, verifyAndRegister, verifyResetOTPAndPassword } = require('../../controllers/auth/authController');
const { protect } = require('../../middlewares/auth/authMiddleware');


const router = express.Router();

router.post('/login', loginUser);
router.post('/register/verify', verifyAndRegister);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/verify', verifyResetOTPAndPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/details', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
