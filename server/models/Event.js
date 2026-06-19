const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: { type: String, enum: ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Other'], default: 'Other' },
    fromLocation: { type: String, trim: true },
    eventLocation: { type: String, trim: true },
    functionHallAddress: { type: String, required: true, trim: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, trim: true },
    guestCount: { type: Number, default: 1, min: 1 },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
