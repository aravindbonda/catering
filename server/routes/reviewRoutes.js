const express = require('express');
const { createReview, getReviews } = require('../controllers/reviewController');
const { protect, requireVerified } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getReviews);
router.post('/', protect, requireVerified, createReview);

module.exports = router;
