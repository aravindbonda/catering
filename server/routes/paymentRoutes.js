const express = require('express');
const { createMockPayment, getMyPayments } = require('../controllers/paymentController');
const { protect, requireVerified } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/mock', protect, requireVerified, createMockPayment);
router.get('/my', protect, requireVerified, getMyPayments);

module.exports = router;
