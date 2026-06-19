const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');

const createMockPayment = asyncHandler(async (req, res) => {
  const { orderId, method = 'Mock' } = req.body;
  const order = await Order.findOne({ _id: orderId, userId: req.user._id });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const payment = await Payment.create({
    userId: req.user._id,
    orderId: order._id,
    amount: order.totalAmount,
    method,
    status: 'Paid',
    transactionId: 'MOCK-' + Date.now()
  });

  order.paymentStatus = 'Paid';
  order.paymentMethod = method === 'Mock' ? 'Online' : method;
  if (order.status === 'Payment Pending') order.status = 'Confirmed';
  await order.save();

  await Notification.create({
    recipientId: req.user._id,
    recipientType: 'user',
    title: 'Payment Successful',
    message: 'Mock payment received for order ' + order._id,
    type: 'payment',
    relatedId: order._id
  });

  res.status(201).json({ success: true, payment, order });
});

const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id }).populate('orderId', 'eventDate status').sort({ createdAt: -1 });
  res.json({ success: true, payments });
});

module.exports = { createMockPayment, getMyPayments };
