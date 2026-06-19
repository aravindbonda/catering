const Order = require('../models/Order');
const Menu = require('../models/Menu');
const Notification = require('../models/Notification');
const Tracking = require('../models/Tracking');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    guestCount,
    adultsCount,
    childrenCount,
    eventDate,
    eventTime,
    eventAddress,
    eventType,
    specialInstructions,
    uploadedFiles = [],
    aiExtractedItems = [],
    assignmentPreference = 'admin',
    selectedVendorId,
    pricing = {}
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('At least one food item is required');
  }

  if (!guestCount || guestCount < 1) {
    res.status(400);
    throw new Error('Valid guest count is required');
  }

  if (!eventDate || !eventAddress) {
    res.status(400);
    throw new Error('Event date and address are required');
  }

  // Validate and enrich items. Uploaded/AI-generated requests may not map to
  // existing Menu documents yet, so direct item pricing is accepted for review.
  const enrichedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    let menuItem = null;
    if (item.menuId && mongoose.Types.ObjectId.isValid(item.menuId)) {
      menuItem = await Menu.findById(item.menuId);
    }

    if (menuItem && menuItem.isAvailable) {
      enrichedItems.push({
        menuId: menuItem._id,
        name: menuItem.name,
        category: menuItem.category,
        price: menuItem.price,
        quantity: item.quantity || 1
      });

      totalAmount += menuItem.price * (item.quantity || 1);
      continue;
    }

    enrichedItems.push({
      name: item.name,
      category: item.category || 'Menu',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1
    });

    totalAmount += (Number(item.price) || 0) * (Number(item.quantity) || 1);
  }

  const grandTotal = Number(pricing.grandTotal) || totalAmount * guestCount;

  const order = await Order.create({
    userId: req.user._id,
    selectedVendorId,
    items: enrichedItems,
    uploadedFiles,
    aiExtractedItems: aiExtractedItems.length ? aiExtractedItems : enrichedItems,
    guestCount,
    adultsCount,
    childrenCount,
    eventDate: new Date(eventDate),
    eventTime,
    eventAddress,
    eventType,
    specialInstructions,
    assignmentPreference,
    pricing,
    totalAmount: grandTotal
  });

  await Tracking.create({
    orderId: order._id,
    currentStatus: order.status,
    steps: [
      { status: 'Admin Review', note: 'Booking request received', updatedBy: 'system' }
    ]
  });

  // Create notification for user
  await Notification.create({
    recipientId: req.user._id,
    recipientType: 'user',
    title: 'Order Placed Successfully',
    message: `Your catering order has been placed successfully. Order ID: ${order._id}`,
    type: 'order',
    relatedId: order._id
  });

  res.status(201).json({
    success: true,
    order,
    message: 'Request submitted successfully. Admin will review and assign the best catering partner.'
  });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { userId: req.user._id };
  if (status) filter.status = status;

  const orders = await Order.find(filter)
    .populate('partnerId', 'fullName cateringBusinessName phone rating')
    .populate('selectedVendorId', 'fullName cateringBusinessName phone rating')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin'
    ? { _id: req.params.id }
    : { _id: req.params.id, $or: [{ userId: req.user._id }, { partnerId: req.user._id }] };

  const order = await Order.findOne(filter)
    .populate('userId', 'fullName email address')
    .populate('partnerId', 'fullName cateringBusinessName phone rating serviceAreas');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({ success: true, order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!['Pending', 'Accepted'].includes(order.status)) {
    res.status(400);
    throw new Error('Order cannot be cancelled at this stage');
  }

  order.status = 'Cancelled';
  order.cancellationReason = cancellationReason;
  order.cancelledAt = new Date();
  await order.save();

  await Tracking.findOneAndUpdate(
    { orderId: order._id },
    {
      currentStatus: 'Cancelled',
      $push: { steps: { status: 'Cancelled', note: cancellationReason || 'Cancelled by customer', updatedBy: 'user', timestamp: new Date() } }
    },
    { upsert: true }
  );

  // Create notifications
  await Notification.create({
    recipientId: req.user._id,
    recipientType: 'user',
    title: 'Order Cancelled',
    message: 'Your order has been cancelled successfully',
    type: 'order',
    relatedId: order._id
  });

  if (order.partnerId) {
    await Notification.create({
      recipientId: order.partnerId,
      recipientType: 'partner',
      title: 'Order Cancelled',
      message: 'An assigned order has been cancelled by the customer',
      type: 'order',
      relatedId: order._id
    });
  }

  res.json({ success: true, order });
});

const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate('partnerId', 'fullName cateringBusinessName rating')
    .select('eventDate eventType totalAmount status createdAt completedAt')
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  getOrderHistory
};
