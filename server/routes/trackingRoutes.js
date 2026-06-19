const express = require('express');
const { getTracking, updateTracking } = require('../controllers/trackingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:orderId', protect, getTracking);
router.patch('/:orderId', protect, updateTracking);

module.exports = router;
