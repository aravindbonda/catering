import React, { useState } from 'react';
import './Food.css';

import chickenBiryani from '../../assets/chickenbiryani.png';
import indiaVeg       from '../../assets/indiaveg.png';
import paneerButter   from '../../assets/paneerbutter.png';
import muttonRogan    from '../../assets/muttonrogan.png';
import gulabJamun     from '../../assets/gulabjamun.png';
import rasgullaSweet  from '../../assets/rasgullasweet.png';

const foodItems = [
  {
    id: 1,
    name: 'Royal Veg Thali',
    category: 'veg',
    description: 'A grand spread of seasonal veggies, dal, rice, roti, and desserts fit for a celebration.',
    tag: 'Best Seller',
    tagColor: '#1a6b2f',
    tagBg: '#e6f4ea',
    image: indiaVeg,
  },
  {
    id: 2,
    name: 'Paneer Butter Masala',
    category: 'veg',
    description: 'Creamy, rich paneer curry in a luscious tomato-butter gravy. Crowd favourite.',
    tag: 'Popular',
    tagColor: '#b45309',
    tagBg: '#fef3c7',
    image: paneerButter,
  },
  {
    id: 3,
    name: 'Chicken Biryani',
    category: 'non-veg',
    description: 'Fragrant basmati rice layered with spiced chicken, saffron, and caramelised onions.',
    tag: "Chef's Choice",
    tagColor: '#FC8019',
    tagBg: '#FFF7F0',
    image: chickenBiryani,
  },
  {
    id: 4,
    name: 'Mutton Rogan Josh',
    category: 'non-veg',
    description: 'Slow-cooked tender mutton in a bold Kashmiri spice blend — a banquet showstopper.',
    tag: 'Premium',
    tagColor: '#6a1b9a',
    tagBg: '#f3e5f5',
    image: muttonRogan,
  },
  {
    id: 5,
    name: 'Gulab Jamun',
    category: 'sweets',
    description: 'Soft, melt-in-mouth milk dumplings soaked in rose-saffron syrup.',
    tag: 'Classic',
    tagColor: '#1565c0',
    tagBg: '#e3f2fd',
    image: gulabJamun,
  },
  {
    id: 6,
    name: 'Rasgulla Platter',
    category: 'sweets',
    description: 'Spongy Bengali rasgullas served chilled — the perfect sweet ending.',
    tag: 'Crowd Favourite',
    tagColor: '#00695c',
    tagBg: '#e0f2f1',
    image: rasgullaSweet,
  },
];

const categories = [
  { key: 'all',     label: 'All Items' },
 
];

const Food = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? foodItems
    : foodItems.filter(f => f.category === activeCategory);

  return (
    <section className="food" id="menu">
      <div className="food__container">

        {/* Section Header */}
        <div className="food__header">
          <span className="food__eyebrow">Our Menu</span>
          <h2 className="food__title">
            Crafted with <span className="food__title-accent">love &amp; spice</span>
          </h2>
          <p className="food__subtitle">
            Explore our hand-picked selection of dishes — freshly prepared for every occasion.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="food__filters">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`food__filter-btn ${
                activeCategory === cat.key ? 'food__filter-btn--active' : ''
              }`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="food__grid">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="food__card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Image with RTL slide animation */}
              <div className="food__card-img-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  className="food__card-img"
                />
                <span
                  className="food__card-tag"
                  style={{ background: item.tagBg, color: item.tagColor }}
                >
                  {item.tag}
                </span>
              </div>

              {/* Body */}
              <div className="food__card-body">
                <h3 className="food__card-name">{item.name}</h3>
                <p className="food__card-desc">{item.description}</p>
                <div className="food__card-footer">
                
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Food;
