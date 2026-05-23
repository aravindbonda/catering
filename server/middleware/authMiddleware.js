const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Partner = require('../models/Partner');
const asyncHandler = require('./asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401);
    throw new Error('Authentication token is required');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');

  // Handle admin token
  if (decoded.id === 'admin') {
    req.user = {
      id: 'admin',
      fullName: 'CaterBliss Admin',
      email: 'admin@catering.com',
      role: 'admin',
      isVerified: true
    };
    return next();
  }

  // Try to find user first
  let entity = await User.findById(decoded.id);

  // If not found as user, try partner
  if (!entity) {
    entity = await Partner.findById(decoded.id);
  }

  if (!entity) {
    res.status(401);
    throw new Error('User/Partner no longer exists');
  }

  req.user = entity;
  next();
});

const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    res.status(403);
    throw new Error('OTP verification required');
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access required');
  }
  next();
};

const partnerOnly = (req, res, next) => {
  if (req.user.role !== 'partner' && req.user.cateringBusinessName === undefined) {
    res.status(403);
    throw new Error('Partner access required');
  }
  next();
};

module.exports = { protect, requireVerified, adminOnly, partnerOnly };
