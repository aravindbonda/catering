const asyncHandler = require('../middleware/asyncHandler');

const mockMenuItems = [
  { name: 'Chicken Biryani', category: 'Rice & Biryani', quantity: 1, price: 180, suggestedServingCount: 1 },
  { name: 'Paneer Butter Masala', category: 'Main Course', quantity: 1, price: 130, suggestedServingCount: 1 },
  { name: 'Veg Manchurian', category: 'Starters', quantity: 1, price: 75, suggestedServingCount: 1 },
  { name: 'Gulab Jamun', category: 'Sweets & Desserts', quantity: 1, price: 45, suggestedServingCount: 1 }
];

const uploadMenu = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    res.status(400);
    throw new Error('Upload at least one PDF or image file');
  }

  const files = req.files.map((file) => ({
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
    previewUrl: '/uploads/' + file.filename
  }));

  res.status(201).json({
    success: true,
    files,
    extractedItems: mockMenuItems,
    message: 'Menu uploaded. Mock AI extraction completed.'
  });
});

const estimateCost = asyncHandler(async (req, res) => {
  const { items = [], guestCount = 1, eventType = 'Other', isLocal = true } = req.body;
  const guests = Math.max(1, Number(guestCount) || 1);
  const perPlatePrice = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  const setupCharges = eventType === 'Wedding' ? 8500 : 5000;
  const transportationCharges = isLocal ? 2500 : 9500;
  const estimatedTotal = perPlatePrice * guests + setupCharges + transportationCharges;
  const serviceCharge = Math.round(estimatedTotal * 0.05);
  const gst = Math.round((estimatedTotal + serviceCharge) * 0.05);
  const grandTotal = estimatedTotal + serviceCharge + gst;

  res.json({
    success: true,
    pricing: { perPlatePrice, setupCharges, transportationCharges, estimatedTotal, serviceCharge, gst, grandTotal }
  });
});

module.exports = { uploadMenu, estimateCost };
