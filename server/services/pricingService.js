const BASE_PRICES = {
  Veg: 120,
  'Non-Veg': 180
};

const CATEGORY_PRICES = {
  Veg: 110,
  'Non-Veg': 160,
  Starters: 55,
  Desserts: 40
};

const calculatePrice = ({ foodType, items, attendees }) => {
  const plates = Number(attendees);

  if (!Number.isFinite(plates) || plates < 1) {
    throw new Error('Attendees must be at least 1');
  }

  const base = BASE_PRICES[foodType] || BASE_PRICES.Veg;
  const addons = items.reduce((sum, item) => {
    return sum + (Number(item.price) || CATEGORY_PRICES[item.category] || 0);
  }, 0);
  const pricePerPlate = base + addons;

  return {
    pricePerPlate,
    totalCost: pricePerPlate * plates
  };
};

module.exports = { calculatePrice };
