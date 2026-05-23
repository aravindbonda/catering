const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  getOrderHistory
} = require('../controllers/orderController');
const { protect, requireVerified } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, requireVerified, createOrder);
router.get('/my', protect, requireVerified, getUserOrders);
router.get('/history', protect, requireVerified, getOrderHistory);
router.get('/:id', protect, requireVerified, getOrder);
router.patch('/:id/cancel', protect, requireVerified, cancelOrder);

module.exports = router;
