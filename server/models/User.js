const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema(
  {
    code: { type: String, select: false },
    expiresAt: { type: Date, select: false },
    purpose: { type: String, enum: ['register', 'reset', null], default: null, select: false },
    channel: { type: String, enum: ['email', null], default: null, select: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    address: { type: String, trim: true },
    functionAddress: { type: String, trim: true },
    primaryEventLocation: { type: String, default: '', trim: true },
    preferredCity: { type: String, default: '', trim: true },
    userType: {
      type: String,
      enum: ['Event Organizer', 'Wedding Planner', 'Corporate User'],
      default: 'Event Organizer'
    },
    role: { type: String, enum: ['user', 'admin', 'partner'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: otpSchema, default: () => ({}) }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
