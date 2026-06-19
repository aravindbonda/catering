const User = require('../models/User');
const Partner = require('../models/Partner');
const asyncHandler = require('../middleware/asyncHandler');
const generateToken = require('../utils/generateToken');
const { createOtp, verifyOtp } = require('../services/otpService');

const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  address: user.address,
  functionAddress: user.functionAddress,
  primaryEventLocation: user.primaryEventLocation,
  preferredCity: user.preferredCity,
  userType: user.userType,
  role: user.role,
  isVerified: user.isVerified
});

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
  earnings: partner.earnings,
  role: 'partner'
});

const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
    primaryEventLocation,
    preferredCity,
    userType = 'Event Organizer'
  } = req.body;

  if (!fullName || !email || !password || !confirmPassword || !primaryEventLocation || !preferredCity) {
    res.status(400);
    throw new Error('All registration fields are required');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    fullName,
    email,
    password,
    primaryEventLocation,
    preferredCity,
    userType,
    address: primaryEventLocation,
    functionAddress: primaryEventLocation
  });

  await createOtp(user, 'register');

  res.status(201).json({
    success: true,
    message: 'Registration successful. Verify OTP to activate your account.',
    user: publicUser(user)
  });
});

const registerPartner = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    village,
    city,
    fullAddress,
    cateringBusinessName,
    serviceAreas,
    experience,
    password,
    confirmPassword
  } = req.body;

  if (!fullName || !email || !phone || !village || !city || !fullAddress ||
      !cateringBusinessName || !serviceAreas || !experience || !password) {
    res.status(400);
    throw new Error('All registration fields are required');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const existing = await Partner.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
  if (existing) {
    res.status(409);
    throw new Error('Partner already exists with this email or phone');
  }

  const partner = await Partner.create({
    fullName,
    email,
    phone,
    village,
    city,
    fullAddress,
    cateringBusinessName,
    serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : [serviceAreas],
    experience,
    password
  });

  await createOtp(partner, 'register');

  res.status(201).json({
    success: true,
    message: 'Partner registration successful. Please verify OTP to complete registration.',
    partner: publicPartner(partner)
  });
});

const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { identifier, otp } = req.body;
  const user = await User.findOne({ email: String(identifier).toLowerCase() })
    .select('+password +otp.code +otp.expiresAt +otp.purpose +otp.channel');

  if (!user || !verifyOtp(user, otp, 'register')) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  user.isVerified = true;
  user.otp = {};
  await user.save();

  res.json({
    success: true,
    token: generateToken(user),
    user: publicUser(user)
  });
});

const verifyPartnerOtp = asyncHandler(async (req, res) => {
  const { identifier, otp } = req.body;
  const partner = await Partner.findOne({ email: String(identifier).toLowerCase() })
    .select('+password +otp.code +otp.expiresAt +otp.purpose +otp.channel');

  if (!partner || !verifyOtp(partner, otp, 'register')) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  partner.isVerified = true;
  partner.otp = {};
  await partner.save();

  res.json({
    success: true,
    message: 'Partner verification successful. Your account is pending admin approval.',
    partner: publicPartner(partner)
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const { identifier, purpose = 'register' } = req.body;
  const email = String(identifier).toLowerCase();
  let account = await User.findOne({ email }).select('+otp.code +otp.expiresAt +otp.purpose +otp.channel');
  if (!account) {
    account = await Partner.findOne({ email }).select('+otp.code +otp.expiresAt +otp.purpose +otp.channel');
  }

  if (!account) {
    res.status(404);
    throw new Error('Account not found');
  }

  await createOtp(account, purpose);
  res.json({ success: true, message: 'Email OTP sent successfully' });
});

const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({ email: String(identifier).toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error('Please verify your account with OTP before login');
  }

  res.json({ success: true, token: generateToken(user), user: publicUser(user) });
});

const partnerLogin = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const partner = await Partner.findOne({ email: String(identifier).toLowerCase() }).select('+password');

  if (!partner || !(await partner.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  if (!partner.isVerified) {
    res.status(403);
    throw new Error('Please verify your account with OTP before login');
  }

  if (partner.status !== 'approved') {
    res.status(403);
    throw new Error(`Your account is ${partner.status}. Please contact admin for approval.`);
  }

  res.json({ success: true, token: generateToken(partner), partner: publicPartner(partner) });
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email !== 'admin@catering.com' || password !== 'admin123') {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  const admin = {
    id: 'admin',
    fullName: 'CaterBliss Admin',
    email: 'admin@catering.com',
    role: 'admin',
    isVerified: true
  };

  res.json({ success: true, token: generateToken(admin), user: admin });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  const user = await User.findOne({ email: String(identifier).toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await createOtp(user, 'reset');
  res.json({ success: true, message: 'Password reset OTP sent to email' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { identifier, otp, password } = req.body;
  const user = await User.findOne({ email: String(identifier).toLowerCase() })
    .select('+password +otp.code +otp.expiresAt +otp.purpose +otp.channel');

  if (!user || !verifyOtp(user, otp, 'reset')) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  user.password = password;
  user.otp = {};
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

const me = asyncHandler(async (req, res) => {
  if (req.user.cateringBusinessName !== undefined) {
    return res.json({ success: true, user: publicPartner(req.user) });
  }

  res.json({ success: true, user: publicUser(req.user) });
});

module.exports = {
  register,
  registerPartner,
  verifyRegistrationOtp,
  verifyPartnerOtp,
  resendOtp,
  login,
  partnerLogin,
  adminLogin,
  forgotPassword,
  resetPassword,
  me
};
