const User = require('../models/User');
const Order = require('../models/Order');
const Partner = require('../models/Partner');
const Menu = require('../models/Menu');
const Notification = require('../models/Notification');
const Earning = require('../models/Earning');
const asyncHandler = require('../middleware/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    paidUsers,
    totalPartners,
    pendingPartners,
    totalOrders,
    revenueResult,
    recentOrders,
    recentPartners
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', isVerified: true }),
    Order.distinct('userId', { paymentStatus: 'Paid' }),
    Partner.countDocuments(),
    Partner.countDocuments({ status: 'pending' }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.find().populate('userId', 'fullName email').sort({ createdAt: -1 }).limit(5),
    Partner.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(5)
  ]);

  const revenue = revenueResult[0]?.total || 0;

  res.json({
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      paidUsers: paidUsers.length,
      totalPartners,
      pendingPartners,
      totalOrders,
      revenue
    },
    recentOrders,
    recentPartners
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role } = req.query;
  const filter = role ? { role } : { role: { $ne: 'admin' } };

  const users = await User.find(filter)
    .select('fullName email preferredCity primaryEventLocation role isVerified createdAt')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = status ? { status } : {};

  const orders = await Order.find(filter)
    .populate('userId', 'fullName email preferredCity primaryEventLocation')
    .populate('partnerId', 'fullName cateringBusinessName phone rating serviceAreas')
    .populate('selectedVendorId', 'fullName cateringBusinessName phone rating serviceAreas')
    .sort('-createdAt')
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

const assignPartner = asyncHandler(async (req, res) => {
  const { partnerId } = req.body;
  const order = await Order.findById(req.params.id);
  const partner = await Partner.findById(partnerId);

  if (!order || !partner) {
    res.status(404);
    throw new Error('Order or partner not found');
  }

  if (partner.status !== 'approved') {
    res.status(400);
    throw new Error('Partner is not approved');
  }

  order.partnerId = partner._id;
  order.status = 'Payment Pending';
  order.assignedAt = new Date();
  await order.save();

  // Update partner stats
  partner.totalOrders += 1;
  await partner.save();

  // Create notification for partner
  await Notification.create({
    recipientId: partner._id,
    recipientType: 'partner',
    title: 'New Order Assigned',
    message: `A new catering order has been assigned to you`,
    type: 'order',
    relatedId: order._id
  });

  // Create earning record
  const commission = order.totalAmount * 0.1; // 10% commission
  await Earning.create({
    partnerId: partner._id,
    orderId: order._id,
    amount: order.totalAmount,
    commission,
    netAmount: order.totalAmount - commission,
    month: new Date().toISOString().slice(0, 7),
    year: new Date().getFullYear()
  });

  res.json({ success: true, order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (status === 'Completed') {
    order.completedAt = new Date();
  } else if (status === 'Cancelled') {
    order.cancelledAt = new Date();
  }

  await order.save();

  res.json({ success: true, order });
});

const updateOrderPricing = asyncHandler(async (req, res) => {
  const { setupCharges, transportationCharges, serviceCharge, gst, grandTotal } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.pricing = {
    ...order.pricing,
    setupCharges: Number(setupCharges ?? order.pricing?.setupCharges ?? 0),
    transportationCharges: Number(transportationCharges ?? order.pricing?.transportationCharges ?? 0),
    serviceCharge: Number(serviceCharge ?? order.pricing?.serviceCharge ?? 0),
    gst: Number(gst ?? order.pricing?.gst ?? 0),
    grandTotal: Number(grandTotal ?? order.totalAmount)
  };
  order.totalAmount = order.pricing.grandTotal;
  await order.save();

  res.json({ success: true, order });
});

const getPartners = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = status ? { status } : {};

  const partners = await Partner.find(filter)
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Partner.countDocuments(filter);

  res.json({
    success: true,
    partners,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const updatePartnerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const partner = await Partner.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!partner) {
    res.status(404);
    throw new Error('Partner not found');
  }

  // Create notification
  await Notification.create({
    recipientId: partner._id,
    recipientType: 'partner',
    title: 'Account Status Update',
    message: `Your partner account status has been updated to ${status}`,
    type: 'partner'
  });

  res.json({ success: true, partner });
});

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find()
    .populate('recipientId', 'fullName email')
    .sort('-createdAt')
    .limit(50);

  res.json({ success: true, notifications });
});

const createNotification = asyncHandler(async (req, res) => {
  const { recipientId, recipientType, title, message, type } = req.body;

  const notification = await Notification.create({
    recipientId,
    recipientType,
    title,
    message,
    type
  });

  res.status(201).json({ success: true, notification });
});

const getEarnings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const earnings = await Earning.find()
    .populate('partnerId', 'fullName cateringBusinessName')
    .populate('orderId', 'totalAmount eventDate')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Earning.countDocuments();
  const totalRevenue = await Earning.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.json({
    success: true,
    earnings,
    summary: {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalEarnings: earnings.length
    },
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

module.exports = {
  getDashboardStats,
  getUsers,
  getOrders,
  assignPartner,
  updateOrderStatus,
  updateOrderPricing,
  getPartners,
  updatePartnerStatus,
  getNotifications,
  createNotification,
  getEarnings
};
