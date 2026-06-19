const Order = require('../models/Order');
const Tracking = require('../models/Tracking');
const asyncHandler = require('../middleware/asyncHandler');

const getTracking = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('partnerId', 'cateringBusinessName fullName phone');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = String(order.userId) === String(req.user._id);
  const isPartner = order.partnerId && String(order.partnerId._id) === String(req.user._id);
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isPartner && !isAdmin) {
    res.status(403);
    throw new Error('Not allowed to track this order');
  }

  let tracking = await Tracking.findOne({ orderId: order._id });
  if (!tracking) {
    tracking = await Tracking.create({
      orderId: order._id,
      currentStatus: order.status,
      steps: [
        { status: 'Admin Review', note: 'Booking request received', updatedBy: 'system' },
        { status: order.status, note: 'Current order status', updatedBy: 'system' }
      ]
    });
  }

  res.json({ success: true, order, tracking });
});

const updateTracking = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isAssignedPartner = order.partnerId && String(order.partnerId) === String(req.user._id);
  const isAdmin = req.user.role === 'admin';

  if (!isAssignedPartner && !isAdmin) {
    res.status(403);
    throw new Error('Only assigned partners or admins can update tracking');
  }

  order.status = status;
  if (status === 'Completed') order.completedAt = new Date();
  await order.save();

  const tracking = await Tracking.findOneAndUpdate(
    { orderId: order._id },
    {
      currentStatus: status,
      $push: { steps: { status, note, updatedBy: req.user.role || 'partner', timestamp: new Date() } }
    },
    { new: true, upsert: true }
  );

  res.json({ success: true, order, tracking });
});

module.exports = { getTracking, updateTracking };
