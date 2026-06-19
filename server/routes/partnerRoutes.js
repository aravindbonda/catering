const express = require('express');
const {
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
} = require('../controllers/partnerController');
const { protect, adminOnly, partnerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/available', (req, res, next) => {
  req.query.status = 'approved';
  return getPartners(req, res, next);
});

// Partner routes
router.get('/profile/me', protect, partnerOnly, getPartnerProfile);
router.put('/profile/me', protect, partnerOnly, updatePartnerProfile);
router.get('/dashboard/stats', protect, partnerOnly, getPartnerDashboard);
router.get('/orders/my', protect, partnerOnly, getPartnerOrders);
router.get('/my-orders', protect, partnerOnly, async (req, res, next) => {
  try {
    const originalJson = res.json.bind(res);
    res.json = (payload) => originalJson({ ...payload, partner: req.user });
    return getPartnerOrders(req, res, next);
  } catch (error) {
    return next(error);
  }
});
router.patch('/orders/:id/status', protect, partnerOnly, updateOrderStatus);
router.get('/earnings/my', protect, partnerOnly, getPartnerEarnings);
router.get('/reviews/my', protect, partnerOnly, getPartnerReviews);
router.get('/notifications/my', protect, partnerOnly, getPartnerNotifications);
router.patch('/notifications/:id/read', protect, partnerOnly, markNotificationRead);

// Admin routes
router.get('/', protect, adminOnly, getPartners);
router.get('/:id', protect, adminOnly, getPartner);
router.patch('/:id/status', protect, adminOnly, updatePartnerStatus);

module.exports = router;
