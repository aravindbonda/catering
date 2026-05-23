const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    recipientType: { type: String, enum: ['user', 'partner', 'admin'], required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ['order', 'partner', 'system', 'payment'], default: 'system' },
    isRead: { type: Boolean, default: false },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // Order ID, Partner ID, etc.
    actionUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);