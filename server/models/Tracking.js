const mongoose = require('mongoose');

const trackingStepSchema = new mongoose.Schema(
  {
    status: { type: String, required: true, trim: true },
    note: { type: String, trim: true },
    updatedBy: { type: String, enum: ['user', 'partner', 'admin', 'system'], default: 'system' },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const trackingSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    currentStatus: { type: String, required: true, trim: true },
    steps: { type: [trackingStepSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tracking', trackingSchema);
