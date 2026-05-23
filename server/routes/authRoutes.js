const express = require('express');
const {
  register,
  registerPartner,
  verifyRegistrationOtp,
  verifyPartnerOtp,
  resendOtp,
  login,
  partnerLogin,
  adminLogin,
  forgotPassword,
  resetPassword,
  me
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/register-partner', registerPartner);
router.post('/verify-otp', verifyRegistrationOtp);
router.post('/verify-partner-otp', verifyPartnerOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/partner-login', partnerLogin);
router.post('/admin-login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, me);

module.exports = router;
