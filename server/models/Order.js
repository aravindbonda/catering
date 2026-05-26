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

const uploadedFileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    size: { type: Number, default: 0 },
    previewUrl: { type: String, trim: true }
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    perPlatePrice: { type: Number, default: 0 },
    setupCharges: { type: Number, default: 0 },
    transportationCharges: { type: Number, default: 0 },
    serviceCharge: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    estimatedTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    selectedVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
    uploadedFiles: { type: [uploadedFileSchema], default: [] },
    aiExtractedItems: { type: [orderItemSchema], default: [] },
    guestCount: { type: Number, required: true, min: 1 },
    adultsCount: { type: Number, default: 0, min: 0 },
    childrenCount: { type: Number, default: 0, min: 0 },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, trim: true },
    eventAddress: { type: String, required: true, trim: true },
    eventType: { type: String, enum: ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Other'], default: 'Other' },
    specialInstructions: { type: String, trim: true },
    assignmentPreference: {
      type: String,
      enum: ['admin', 'manual'],
      default: 'admin'
    },
    pricing: { type: pricingSchema, default: () => ({}) },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Admin Review', 'Pending', 'Accepted', 'Preparing', 'Out for Service', 'Payment Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Admin Review'
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
