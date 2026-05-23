const Menu = require('../models/Menu');
const asyncHandler = require('../middleware/asyncHandler');

const getMenuItems = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category, isAvailable: true } : { isAvailable: true };

  const menuItems = await Menu.find(filter).sort({ category: 1, name: 1 });
  res.json({ success: true, menu: menuItems });
});

const getMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await Menu.findById(req.params.id);

  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  res.json({ success: true, menuItem });
});

const createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, ingredients, allergens } = req.body;

  if (!name || !price || !category) {
    res.status(400);
    throw new Error('Name, price, and category are required');
  }

  const menuItem = await Menu.create({
    name,
    description,
    price,
    category,
    image,
    ingredients: ingredients || [],
    allergens: allergens || []
  });

  res.status(201).json({ success: true, menuItem });
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, ingredients, allergens, isAvailable } = req.body;

  const menuItem = await Menu.findById(req.params.id);

  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  menuItem.name = name || menuItem.name;
  menuItem.description = description || menuItem.description;
  menuItem.price = price !== undefined ? price : menuItem.price;
  menuItem.category = category || menuItem.category;
  menuItem.image = image || menuItem.image;
  menuItem.ingredients = ingredients || menuItem.ingredients;
  menuItem.allergens = allergens || menuItem.allergens;
  menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;

  await menuItem.save();

  res.json({ success: true, menuItem });
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await Menu.findById(req.params.id);

  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  await menuItem.deleteOne();
  res.json({ success: true, message: 'Menu item deleted successfully' });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Menu.distinct('category', { isAvailable: true });
  res.json({ success: true, categories });
});

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories
};