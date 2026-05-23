const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ['Veg', 'Non-Veg', 'Starters', 'Desserts'] },
    image: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    ingredients: [{ type: String, trim: true }],
    allergens: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', menuItemSchema);