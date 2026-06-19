const Review = require('../models/Review');
const Order = require('../models/Order');
const Partner = require('../models/Partner');
const asyncHandler = require('../middleware/asyncHandler');

const createReview = asyncHandler(async (req, res) => {
  const { orderId, rating, comment } = req.body;
  const order = await Order.findOne({ _id: orderId, userId: req.user._id });

  if (!order || !order.partnerId) {
    res.status(404);
    throw new Error('Completed assigned order is required for review');
  }

  const review = await Review.create({
    userId: req.user._id,
    partnerId: order.partnerId,
    orderId: order._id,
    rating,
    comment,
    isVerified: order.status === 'Completed'
  });

  const reviews = await Review.find({ partnerId: order.partnerId });
  const average = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  await Partner.findByIdAndUpdate(order.partnerId, { rating: Number(average.toFixed(1)) });

  res.status(201).json({ success: true, review });
});

const getReviews = asyncHandler(async (req, res) => {
  const filter = req.query.partnerId ? { partnerId: req.query.partnerId } : {};
  const reviews = await Review.find(filter)
    .populate('userId', 'fullName')
    .populate('partnerId', 'cateringBusinessName fullName')
    .populate('orderId', 'eventDate eventType')
    .sort({ createdAt: -1 });

  res.json({ success: true, reviews });
});

module.exports = { createReview, getReviews };
