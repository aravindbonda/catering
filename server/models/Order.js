const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 1, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
    guestCount: { type: Number, required: true, min: 1 },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, trim: true },
    eventAddress: { type: String, required: true, trim: true },
    eventType: { type: String, enum: ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Other'], default: 'Other' },
    specialInstructions: { type: String, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Preparing', 'Out for Service', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['Cash', 'Online', 'Card'], default: 'Cash' },
    assignedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
