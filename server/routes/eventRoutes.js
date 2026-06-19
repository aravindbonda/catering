const express = require('express');
const { createEvent, getMyEvents } = require('../controllers/eventController');
const { protect, requireVerified } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, requireVerified, createEvent);
router.get('/my', protect, requireVerified, getMyEvents);

module.exports = router;
