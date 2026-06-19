const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['Mock', 'Cash', 'Online', 'Card'], default: 'Mock' },
    status: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Paid' },
    transactionId: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
