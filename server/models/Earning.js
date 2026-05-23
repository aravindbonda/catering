const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema(
  {
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true, min: 0 },
    commission: { type: Number, default: 0 }, // Platform commission
    netAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
    paidAt: { type: Date },
    month: { type: String, required: true }, // YYYY-MM format
    year: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Earning', earningSchema);