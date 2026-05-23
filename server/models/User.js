const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema(
  {
    code: { type: String, select: false },
    expiresAt: { type: Date, select: false },
    purpose: { type: String, enum: ['register', 'reset', null], default: null, select: false },
    channel: { type: String, enum: ['email', 'phone', null], default: null, select: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    mobile: { type: String, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    address: { type: String, required: true, trim: true },
    functionAddress: { type: String, required: true, trim: true },
    role: { type: String, enum: ['user', 'admin', 'partner'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: otpSchema, default: () => ({}) }
  },
  { timestamps: true }
);

userSchema.pre('validate', function (next) {
  if (!this.phone && this.mobile) this.phone = this.mobile;
  if (!this.mobile && this.phone) this.mobile = this.phone;
  next();
});

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
