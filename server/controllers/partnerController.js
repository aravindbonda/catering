const Partner = require('../models/Partner');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const Review = require('../models/Review');
const Earning = require('../models/Earning');
const asyncHandler = require('../middleware/asyncHandler');

const publicPartner = (partner) => ({
  id: partner._id,
  fullName: partner.fullName,
  email: partner.email,
  phone: partner.phone,
  village: partner.village,
  city: partner.city,
  fullAddress: partner.fullAddress,
  cateringBusinessName: partner.cateringBusinessName,
  serviceAreas: partner.serviceAreas,
  experience: partner.experience,
  status: partner.status,
  isVerified: partner.isVerified,
  profileImage: partner.profileImage,
  rating: partner.rating,
  totalOrders: partner.totalOrders,
  earnings: partner.earnings
});

const getPartners = asyncHandler(async (req, res) => {
  const { status, city } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (city) filter.city = new RegExp(city, 'i');

  const partners = await Partner.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, partners: partners.map(publicPartner) });
});

const getPartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    res.status(404);
    throw new Error('Partner not found');
  }

  res.json({ success: true, partner: publicPartner(partner) });
});

const updatePartnerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const partner = await Partner.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!partner) {
    res.status(404);
    throw new Error('Partner not found');
  }

  // Create notification for partner
  await Notification.create({
    recipientId: partner._id,
    recipientType: 'partner',
    title: 'Account Status Update',
    message: `Your partner account has been ${status}`,
    type: 'partner'
  });

  res.json({ success: true, partner: publicPartner(partner) });
});

const getPartnerProfile = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.user._id);

  if (!partner) {
    res.status(404);
    throw new Error('Partner profile not found');
  }

  res.json({ success: true, partner: publicPartner(partner) });
});

const updatePartnerProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'fullName', 'phone', 'village', 'city', 'fullAddress',
    'cateringBusinessName', 'serviceAreas', 'experience', 'profileImage'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const partner = await Partner.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );

  if (!partner) {
    res.status(404);
    throw new Error('Partner not found');
  }

  res.json({ success: true, partner: publicPartner(partner) });
});

const getPartnerOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = { partnerId: req.user._id };
  if (status) filter.status = status;

  const orders = await Order.find(filter)
    .populate('userId', 'fullName email phone')
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

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Accepted', 'Preparing', 'Out for Service', 'Completed', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, partnerId: req.user._id },
    { status, ...(status === 'Completed' && { completedAt: new Date() }) },
    { new: true }
  ).populate('userId', 'fullName email phone');

  if (!order) {
    res.status(404);
    throw new Error('Order not found or not assigned to you');
  }

  // Create notification for user
  await Notification.create({
    recipientId: order.userId._id,
    recipientType: 'user',
    title: 'Order Status Update',
    message: `Your order status has been updated to ${status}`,
    type: 'order',
    relatedId: order._id
  });

  res.json({ success: true, order });
});

const getPartnerDashboard = asyncHandler(async (req, res) => {
  const partnerId = req.user._id;

  const [
    totalOrders,
    activeOrders,
    completedOrders,
    pendingOrders,
    monthlyRevenue,
    recentOrders,
    reviews
  ] = await Promise.all([
    Order.countDocuments({ partnerId }),
    Order.countDocuments({ partnerId, status: { $in: ['Accepted', 'Preparing', 'Out for Service'] } }),
    Order.countDocuments({ partnerId, status: 'Completed' }),
    Order.countDocuments({ partnerId, status: 'Pending' }),
    Earning.aggregate([
      { $match: { partnerId } },
      { $group: { _id: null, total: { $sum: '$netAmount' } } }
    ]),
    Order.find({ partnerId }).sort({ createdAt: -1 }).limit(5).populate('userId', 'fullName'),
    Review.find({ partnerId }).sort({ createdAt: -1 }).limit(10).populate('userId', 'fullName')
  ]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  res.json({
    success: true,
    stats: {
      totalOrders,
      activeOrders,
      completedOrders,
      pendingOrders,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      averageRating: avgRating.toFixed(1)
    },
    recentOrders,
    recentReviews: reviews
  });
});

const getPartnerEarnings = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const filter = { partnerId: req.user._id };
  if (month && year) {
    filter.month = `${year}-${month.padStart(2, '0')}`;
  }

  const earnings = await Earning.find(filter).sort({ createdAt: -1 });
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.netAmount, 0);
  const pendingPayments = earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.netAmount, 0);

  res.json({
    success: true,
    earnings,
    summary: {
      totalEarnings,
      pendingPayments,
      paidAmount: totalEarnings - pendingPayments
    }
  });
});

const getPartnerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ partnerId: req.user._id })
    .populate('userId', 'fullName')
    .populate('orderId', 'eventDate eventType')
    .sort({ createdAt: -1 });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  res.json({
    success: true,
    reviews,
    averageRating: averageRating.toFixed(1),
    totalReviews: reviews.length
  });
});

const getPartnerNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipientId: req.user._id,
    recipientType: 'partner'
  }).sort({ createdAt: -1 }).limit(50);

  res.json({ success: true, notifications });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipientId: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.json({ success: true, notification });
});

module.exports = {
  getPartners,
  getPartner,
  updatePartnerStatus,
  getPartnerProfile,
  updatePartnerProfile,
  getPartnerOrders,
  updateOrderStatus,
  getPartnerDashboard,
  getPartnerEarnings,
  getPartnerReviews,
  getPartnerNotifications,
  markNotificationRead
};
