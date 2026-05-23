const express = require('express');
const {
  getDashboardStats,
  getUsers,
  getOrders,
  assignPartner,
  updateOrderStatus,
  getPartners,
  updatePartnerStatus,
  getNotifications,
  createNotification,
  getEarnings
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.patch('/orders/:id/assign-partner', assignPartner);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/partners', getPartners);
router.patch('/partners/:id/status', updatePartnerStatus);
router.get('/notifications', getNotifications);
router.post('/notifications', createNotification);
router.get('/earnings', getEarnings);

module.exports = router;
