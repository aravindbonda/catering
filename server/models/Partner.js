const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    village: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    fullAddress: { type: String, required: true, trim: true },
    cateringBusinessName: { type: String, required: true, trim: true },
    serviceAreas: [{ type: String, trim: true }],
    experience: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
    isVerified: { type: Boolean, default: false },
    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
      purpose: { type: String, enum: ['register', 'reset'], default: 'register', select: false }
    },
    profileImage: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalOrders: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 }
  },
  { timestamps: true }
);

partnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

partnerSchema.methods.matchPassword = function (password) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Partner', partnerSchema);
