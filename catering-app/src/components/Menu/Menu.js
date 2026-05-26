import React, { useState } from 'react';
import './Menu.css';

// ── Starters Veg ──
import AlooTikki        from '../../assets/Menu/Starters/AlooTikki.png';
import CornCheeseBalls  from '../../assets/Menu/Starters/CornCheeseBalls.png';
import HaraBharaKabab   from '../../assets/Menu/Starters/HaraBharaKabab.png';
import PaneerTikka      from '../../assets/Menu/Starters/paneer.png';
import SpringRolls      from '../../assets/Menu/Starters/SpringRolls.png';
import VegManchurian    from '../../assets/Menu/Starters/VegManchurian.png';
import VegSeekhKabab    from '../../assets/Menu/Starters/VegSeekhKabab.png';

// ── Starters Non-Veg ──
import Chicken65        from '../../assets/Menu/Starters(non veg)/chicken65.png';
import ChickenLollipop  from '../../assets/Menu/Starters(non veg)/ChickenLollipop.png';
import FishFry          from '../../assets/Menu/Starters(non veg)/FishFry.png';
import MuttonSeekhKabab from '../../assets/Menu/Starters(non veg)/MuttonSeekhKabab.png';
import PrawnFry         from '../../assets/Menu/Starters(non veg)/PrawnFry.png';
import TandooriChicken  from '../../assets/Menu/Starters(non veg)/TandooriChicken.png';

// ── Main Course Veg ──
import AlooGobi         from '../../assets/Menu/Main Course/AlooGobi.png';
import ChanaMasala      from '../../assets/Menu/Main Course/ChanaMasala.png';
import DalTadka         from '../../assets/Menu/Main Course/DalTadka.png';
import MixedVegCurry    from '../../assets/Menu/Main Course/MixedVegCurry.png';
import PalakPaneer      from '../../assets/Menu/Main Course/PalakPaneer.png';
import PaneerButterMasala from '../../assets/Menu/Main Course/PaneerButterMasala.png';
import VegKolhapuri     from '../../assets/Menu/Main Course/VegKolhapuri.png';

// ── Main Course Non-Veg ──
import ChickenButterMasala from '../../assets/Menu/Main Course(Non veg)/ChickenButterMasala.png';
import ChickenChettinad  from '../../assets/Menu/Main Course(Non veg)/ChickenChettinad.png';
import ChickenCurry      from '../../assets/Menu/Main Course(Non veg)/ChickenCurry.png';
import EggCurry          from '../../assets/Menu/Main Course(Non veg)/EggCurry.png';
import FishCurry         from '../../assets/Menu/Main Course(Non veg)/FishCurry.png';
import KeemaMasala       from '../../assets/Menu/Main Course(Non veg)/KeemaMasala.png';
import MuttonRoganJosh   from '../../assets/Menu/Main Course(Non veg)/MuttonRoganJosh.png';
import PrawnMasala       from '../../assets/Menu/Main Course(Non veg)/PrawnMasala.png';

// ── Rice & Biryani ──
import CurdRice         from '../../assets/Menu/Rice & Biryani/Curd Rice.png';
import EggFriedRice     from '../../assets/Menu/Rice & Biryani/Egg Fried Rice.png';
import JeeraRice        from '../../assets/Menu/Rice & Biryani/JeeraRice.png';
import LemonRice        from '../../assets/Menu/Rice & Biryani/Lemon Rice.png';
import MuttonBiryani    from '../../assets/Menu/Rice & Biryani/MuttonBiryani.png';
import VegBiryani       from '../../assets/Menu/Rice & Biryani/VegBiryani.png';
import VegFriedRice     from '../../assets/Menu/Rice & Biryani/VegFriedRice.png';

// ── Breads ──
import ButterNaan       from '../../assets/Menu/Breads/Butter Naan.png';
import GarlicNaan       from '../../assets/Menu/Breads/Garlic Naan.png';
import Parotta          from '../../assets/Menu/Breads/Parotta.png';
import Puri             from '../../assets/Menu/Breads/Puri.png';
import TandooriRoti     from '../../assets/Menu/Breads/Tandoori Roti.png';

// ── Salads & Raita ──
import BoondiRaita      from '../../assets/Menu/Salads & Raita/Boondi Raita.png';
import FruitSalad       from '../../assets/Menu/Salads & Raita/Fruit Salad.png';
import KachumberSalad   from '../../assets/Menu/Salads & Raita/Kachumber Salad.png';
import MixedVegSalad    from '../../assets/Menu/Salads & Raita/Mixed Veg Salad.png';
import OnionRaita       from '../../assets/Menu/Salads & Raita/Onion Raita.png';

// ── Sweets & Desserts ──
import Barfi            from '../../assets/Menu/Sweets & Desserts/Barfi.png';
import GajarHalwa       from '../../assets/Menu/Sweets & Desserts/Gajar Halwa.png';
import GulabJamun       from '../../assets/Menu/Sweets & Desserts/Gulab Jamun.png';
import Halwa            from '../../assets/Menu/Sweets & Desserts/Halwa.png';
import Jalebi           from '../../assets/Menu/Sweets & Desserts/Jalebi.png';
import Kheer            from '../../assets/Menu/Sweets & Desserts/Kheer.png';
import Ladoo            from '../../assets/Menu/Sweets & Desserts/Ladoo.png';
import MoongDalHalwa    from '../../assets/Menu/Sweets & Desserts/Moong Dal Halwa.png';
import Payasam          from '../../assets/Menu/Sweets & Desserts/Payasam.png';
import Peda             from '../../assets/Menu/Sweets & Desserts/Peda.png';
import Rasgulla         from '../../assets/Menu/Sweets & Desserts/Rasgulla.png';
import Rasmalai         from '../../assets/Menu/Sweets & Desserts/Rasmalai.png';

// ── South Indian ──
import IdliSambar       from '../../assets/Menu/South Indian/Idli Sambar.png';
import MasalaDosa       from '../../assets/Menu/South Indian/Masala Dosa.png';
import PlainDosa        from '../../assets/Menu/South Indian/Plain Dosa.png';
import Pongal           from '../../assets/Menu/South Indian/Pongal.png';
import Upma             from '../../assets/Menu/South Indian/Upma.png';
import Uttapam          from '../../assets/Menu/South Indian/Uttapam.png';
import VadaSambar       from '../../assets/Menu/South Indian/Vada Sambar.png';

// ── Pani Puri & Chaat ──
import AlooTikkiChaat   from '../../assets/Menu/Pani Puri & Chaat/Aloo Tikki Chaat.png';
import DahiBhalla       from '../../assets/Menu/Pani Puri & Chaat/Dahi Bhalla.png';
import PaniPuri         from '../../assets/Menu/Pani Puri & Chaat/Pani Puri.png';
import PapdiChaat       from '../../assets/Menu/Pani Puri & Chaat/Papdi Chaat.png';
import RagdaPattice     from '../../assets/Menu/Pani Puri & Chaat/Ragda Pattice.png';

// ── Drinks & Beverages ──
import BadamMilk        from '../../assets/Menu/Drinks & Beverages/Badam Milk.png';
import FreshLimeSoda    from '../../assets/Menu/Drinks & Beverages/Fresh Lime Soda.png';
import MangoLassi       from '../../assets/Menu/Drinks & Beverages/Mango Lassi.png';
import MasalaChai       from '../../assets/Menu/Drinks & Beverages/Masala Chai.png';
import PlainLassi       from '../../assets/Menu/Drinks & Beverages/Plain Lassi.png';
import RoseSharbat      from '../../assets/Menu/Drinks & Beverages/Rose Sharbat.png';

// ══════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════
const categories = [
  { key: 'all',         label: 'All Items',          icon: '🍽️' },
  { key: 'starters',    label: 'Starters',            icon: '🥗' },
  { key: 'main',        label: 'Main Course',         icon: '🍛' },
  { key: 'rice',        label: 'Rice & Biryani',      icon: '🍚' },
  { key: 'breads',      label: 'Breads',              icon: '🫓' },
  { key: 'salads',      label: 'Salads & Raita',      icon: '🥙' },
  { key: 'south',       label: 'South Indian',        icon: '🥘' },
  { key: 'chaat',       label: 'Pani Puri & Chaat',   icon: '💧' },
  { key: 'sweets',      label: 'Sweets & Desserts',   icon: '🍮' },
  { key: 'drinks',      label: 'Drinks',              icon: '🥤' },
];

const menuItems = [
  // ── Starters Veg ──
  { id:1,  name:'Aloo Tikki',         category:'starters', type:'veg',     image: AlooTikki,         desc:'Crispy potato patties seasoned with spices.' },
  { id:2,  name:'Corn Cheese Balls',  category:'starters', type:'veg',     image: CornCheeseBalls,   desc:'Golden fried balls stuffed with corn & cheese.' },
  { id:3,  name:'Hara Bhara Kabab',   category:'starters', type:'veg',     image: HaraBharaKabab,    desc:'Spinach & pea kababs with mint chutney.' },
  { id:4,  name:'Paneer Tikka',       category:'starters', type:'veg',     image: PaneerTikka,       desc:'Marinated paneer grilled to smoky perfection.' },
  { id:5,  name:'Spring Rolls',       category:'starters', type:'veg',     image: SpringRolls,       desc:'Crispy rolls filled with seasoned vegetables.' },
  { id:6,  name:'Veg Manchurian',     category:'starters', type:'veg',     image: VegManchurian,     desc:'Indo-Chinese style veggie balls in spicy sauce.' },
  { id:7,  name:'Veg Seekh Kabab',    category:'starters', type:'veg',     image: VegSeekhKabab,     desc:'Grilled vegetable kababs on skewers.' },
  // ── Starters Non-Veg ──
  { id:8,  name:'Chicken 65',         category:'starters', type:'non-veg', image: Chicken65,         desc:'Spicy deep-fried chicken, a South Indian classic.' },
  { id:9,  name:'Chicken Lollipop',   category:'starters', type:'non-veg', image: ChickenLollipop,   desc:'Juicy chicken wings shaped like lollipops.' },
  { id:10, name:'Fish Fry',           category:'starters', type:'non-veg', image: FishFry,           desc:'Crispy batter-fried fish with tangy dip.' },
  { id:11, name:'Mutton Seekh Kabab', category:'starters', type:'non-veg', image: MuttonSeekhKabab,  desc:'Minced mutton kababs with aromatic spices.' },
  { id:12, name:'Prawn Fry',          category:'starters', type:'non-veg', image: PrawnFry,          desc:'Crunchy fried prawns tossed in coastal spices.' },
  { id:13, name:'Tandoori Chicken',   category:'starters', type:'non-veg', image: TandooriChicken,   desc:'Slow-roasted chicken in tandoor with rich masala.' },

  // ── Main Course Veg ──
  { id:14, name:'Aloo Gobi',          category:'main',     type:'veg',     image: AlooGobi,          desc:'Potatoes & cauliflower cooked with cumin & spices.' },
  { id:15, name:'Chana Masala',       category:'main',     type:'veg',     image: ChanaMasala,       desc:'Bold chickpea curry packed with tangy flavour.' },
  { id:16, name:'Dal Tadka',          category:'main',     type:'veg',     image: DalTadka,          desc:'Creamy lentils tempered with garlic & mustard.' },
  { id:17, name:'Mixed Veg Curry',    category:'main',     type:'veg',     image: MixedVegCurry,     desc:'Seasonal veggies in a rich, spiced gravy.' },
  { id:18, name:'Palak Paneer',       category:'main',     type:'veg',     image: PalakPaneer,       desc:'Cottage cheese cubes in silky spinach gravy.' },
  { id:19, name:'Paneer Butter Masala',category:'main',    type:'veg',     image: PaneerButterMasala,desc:'Rich tomato-butter gravy with soft paneer.' },
  { id:20, name:'Veg Kolhapuri',      category:'main',     type:'veg',     image: VegKolhapuri,      desc:'Fiery Kolhapuri spiced mixed vegetable curry.' },
  // ── Main Course Non-Veg ──
  { id:21, name:'Chicken Butter Masala',category:'main',   type:'non-veg', image: ChickenButterMasala,desc:'Tender chicken in a velvety butter-tomato sauce.' },
  { id:22, name:'Chicken Chettinad', category:'main',      type:'non-veg', image: ChickenChettinad,  desc:'Aromatic South Indian pepper-spiced chicken.' },
  { id:23, name:'Chicken Curry',     category:'main',      type:'non-veg', image: ChickenCurry,      desc:'Classic home-style chicken in onion-tomato gravy.' },
  { id:24, name:'Egg Curry',         category:'main',      type:'non-veg', image: EggCurry,          desc:'Boiled eggs simmered in spiced masala gravy.' },
  { id:25, name:'Fish Curry',        category:'main',      type:'non-veg', image: FishCurry,         desc:'Coastal fish curry with coconut & tamarind.' },
  { id:26, name:'Keema Masala',      category:'main',      type:'non-veg', image: KeemaMasala,       desc:'Minced meat cooked with peas & warming spices.' },
  { id:27, name:'Mutton Rogan Josh', category:'main',      type:'non-veg', image: MuttonRoganJosh,   desc:'Slow-cooked mutton in Kashmiri spice blend.' },
  { id:28, name:'Prawn Masala',      category:'main',      type:'non-veg', image: PrawnMasala,       desc:'Juicy prawns in a tangy spiced onion gravy.' },

  // ── Rice & Biryani ──
  { id:29, name:'Curd Rice',         category:'rice',      type:'veg',     image: CurdRice,          desc:'Cool, creamy curd rice — the perfect comfort food.' },
  { id:30, name:'Egg Fried Rice',    category:'rice',      type:'non-veg', image: EggFriedRice,      desc:'Wok-tossed rice with scrambled egg & vegetables.' },
  { id:31, name:'Jeera Rice',        category:'rice',      type:'veg',     image: JeeraRice,         desc:'Fragrant basmati tempered with cumin seeds.' },
  { id:32, name:'Lemon Rice',        category:'rice',      type:'veg',     image: LemonRice,         desc:'Tangy South Indian lemon rice with peanuts.' },
  { id:33, name:'Mutton Biryani',    category:'rice',      type:'non-veg', image: MuttonBiryani,     desc:'Slow-cooked mutton layered with saffron basmati.' },
  { id:34, name:'Veg Biryani',       category:'rice',      type:'veg',     image: VegBiryani,        desc:'Fragrant basmati with spiced seasonal vegetables.' },
  { id:35, name:'Veg Fried Rice',    category:'rice',      type:'veg',     image: VegFriedRice,      desc:'Indo-Chinese style wok-fried vegetable rice.' },

  // ── Breads ──
  { id:36, name:'Butter Naan',       category:'breads',    type:'veg',     image: ButterNaan,        desc:'Soft tandoor bread brushed with butter.' },
  { id:37, name:'Garlic Naan',       category:'breads',    type:'veg',     image: GarlicNaan,        desc:'Fluffy naan topped with garlic & coriander.' },
  { id:38, name:'Parotta',           category:'breads',    type:'veg',     image: Parotta,           desc:'Flaky layered South Indian flatbread.' },
  { id:39, name:'Puri',              category:'breads',    type:'veg',     image: Puri,              desc:'Deep-fried golden puffed wheat bread.' },
  { id:40, name:'Tandoori Roti',     category:'breads',    type:'veg',     image: TandooriRoti,      desc:'Whole wheat roti baked in a clay tandoor.' },

  // ── Salads & Raita ──
  { id:41, name:'Boondi Raita',      category:'salads',    type:'veg',     image: BoondiRaita,       desc:'Chilled yoghurt with crispy boondi pearls.' },
  { id:42, name:'Fruit Salad',       category:'salads',    type:'veg',     image: FruitSalad,        desc:'Fresh seasonal fruits tossed in honey-lemon.' },
  { id:43, name:'Kachumber Salad',   category:'salads',    type:'veg',     image: KachumberSalad,    desc:'Crisp cucumber, onion & tomato salad.' },
  { id:44, name:'Mixed Veg Salad',   category:'salads',    type:'veg',     image: MixedVegSalad,     desc:'Colourful garden fresh vegetable salad.' },
  { id:45, name:'Onion Raita',       category:'salads',    type:'veg',     image: OnionRaita,        desc:'Cooling yoghurt with fresh sliced onions.' },

  // ── South Indian ──
  { id:46, name:'Idli Sambar',       category:'south',     type:'veg',     image: IdliSambar,        desc:'Steamed rice cakes served with lentil sambar.' },
  { id:47, name:'Masala Dosa',       category:'south',     type:'veg',     image: MasalaDosa,        desc:'Crispy crepe filled with spiced potato masala.' },
  { id:48, name:'Plain Dosa',        category:'south',     type:'veg',     image: PlainDosa,         desc:'Golden thin crispy dosa with coconut chutney.' },
  { id:49, name:'Pongal',            category:'south',     type:'veg',     image: Pongal,            desc:'Comforting rice & lentil dish with pepper ghee.' },
  { id:50, name:'Upma',              category:'south',     type:'veg',     image: Upma,              desc:'Savoury semolina cooked with vegetables & spices.' },
  { id:51, name:'Uttapam',           category:'south',     type:'veg',     image: Uttapam,           desc:'Thick rice pancake topped with onion & tomato.' },
  { id:52, name:'Vada Sambar',       category:'south',     type:'veg',     image: VadaSambar,        desc:'Crispy lentil doughnuts dipped in spiced sambar.' },

  // ── Pani Puri & Chaat ──
  { id:53, name:'Aloo Tikki Chaat',  category:'chaat',     type:'veg',     image: AlooTikkiChaat,    desc:'Crispy tikki topped with chutneys & yoghurt.' },
  { id:54, name:'Dahi Bhalla',       category:'chaat',     type:'veg',     image: DahiBhalla,        desc:'Lentil dumplings soaked in sweet spiced curd.' },
  { id:55, name:'Pani Puri',         category:'chaat',     type:'veg',     image: PaniPuri,          desc:'Crispy shells filled with spicy tangy water.' },
  { id:56, name:'Papdi Chaat',       category:'chaat',     type:'veg',     image: PapdiChaat,        desc:'Crunchy papdi with chutneys, curd & sev.' },
  { id:57, name:'Ragda Pattice',     category:'chaat',     type:'veg',     image: RagdaPattice,      desc:'Potato patties topped with white pea ragda.' },

  // ── Sweets & Desserts ──
  { id:58, name:'Barfi',             category:'sweets',    type:'veg',     image: Barfi,             desc:'Dense milk-based sweet with a melt-in-mouth texture.' },
  { id:59, name:'Gajar Halwa',       category:'sweets',    type:'veg',     image: GajarHalwa,        desc:'Slow-cooked carrot pudding with ghee & nuts.' },
  { id:60, name:'Gulab Jamun',       category:'sweets',    type:'veg',     image: GulabJamun,        desc:'Soft milk dumplings soaked in rose-saffron syrup.' },
  { id:61, name:'Halwa',             category:'sweets',    type:'veg',     image: Halwa,             desc:'Rich semolina pudding with cardamom & raisins.' },
  { id:62, name:'Jalebi',            category:'sweets',    type:'veg',     image: Jalebi,            desc:'Crispy spirals soaked in sugar syrup.' },
  { id:63, name:'Kheer',             category:'sweets',    type:'veg',     image: Kheer,             desc:'Creamy rice pudding with saffron & cardamom.' },
  { id:64, name:'Ladoo',             category:'sweets',    type:'veg',     image: Ladoo,             desc:'Sweet besan balls with ghee & dry fruits.' },
  { id:65, name:'Moong Dal Halwa',   category:'sweets',    type:'veg',     image: MoongDalHalwa,     desc:'Rich lentil halwa slow-cooked in ghee & sugar.' },
  { id:66, name:'Payasam',           category:'sweets',    type:'veg',     image: Payasam,           desc:'South Indian milk & vermicelli dessert.' },
  { id:67, name:'Peda',              category:'sweets',    type:'veg',     image: Peda,              desc:'Classic milk fudge flavoured with cardamom.' },
  { id:68, name:'Rasgulla',          category:'sweets',    type:'veg',     image: Rasgulla,          desc:'Spongy Bengali cheese balls in light sugar syrup.' },
  { id:69, name:'Rasmalai',          category:'sweets',    type:'veg',     image: Rasmalai,          desc:'Soft paneer discs soaked in saffron cream.' },

  // ── Drinks & Beverages ──
  { id:70, name:'Badam Milk',        category:'drinks',    type:'veg',     image: BadamMilk,         desc:'Warm almond milk with saffron & cardamom.' },
  { id:71, name:'Fresh Lime Soda',   category:'drinks',    type:'veg',     image: FreshLimeSoda,     desc:'Chilled lime soda — sweet, salty or masala.' },
  { id:72, name:'Mango Lassi',       category:'drinks',    type:'veg',     image: MangoLassi,        desc:'Thick mango-blended yoghurt drink.' },
  { id:73, name:'Masala Chai',       category:'drinks',    type:'veg',     image: MasalaChai,        desc:'Spiced Indian tea with ginger & cardamom.' },
  { id:74, name:'Plain Lassi',       category:'drinks',    type:'veg',     image: PlainLassi,        desc:'Classic chilled yoghurt drink.' },
  { id:75, name:'Rose Sharbat',      category:'drinks',    type:'veg',     image: RoseSharbat,       desc:'Chilled rose-flavoured sweet drink.' },
];

// ══════════════════════════════════════════
//  COMPONENT
// ══════════════════════════════════════════
const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType,     setActiveType]     = useState('all');
  const [search,         setSearch]         = useState('');

  const filtered = menuItems.filter(item => {
    const catMatch  = activeCategory === 'all' || item.category === activeCategory;
    const typeMatch = activeType === 'all' || item.type === activeType;
    const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && typeMatch && searchMatch;
  });

  // Group by category for section headers
  const grouped = categories
    .filter(c => c.key !== 'all')
    .map(c => ({
      ...c,
      items: filtered.filter(i => i.category === c.key),
    }))
    .filter(c => c.items.length > 0);

  const totalVeg    = filtered.filter(i => i.type === 'veg').length;
  const totalNonVeg = filtered.filter(i => i.type === 'non-veg').length;

  return (
    <div className="menu">

      {/* ── HERO BANNER ── */}
      <div className="menu__hero">
        <div className="menu__hero-orb menu__hero-orb--1" />
        <div className="menu__hero-orb menu__hero-orb--2" />
        <div className="menu__hero-content">
          <span className="menu__eyebrow">Explore Our Menu</span>
          <h1 className="menu__hero-title">
            Crafted with <span className="menu__hero-accent">love & spice</span>
          </h1>
          <p className="menu__hero-sub">
            {menuItems.length}+ dishes across {categories.length - 1} categories — freshly prepared for every occasion.
          </p>
          {/* Search */}
          <div className="menu__search-wrap">
            <span className="menu__search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search dishes..."
              className="menu__search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="menu__search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="menu__stats-strip">
        <div className="menu__stat">
          <span className="menu__stat-num">{menuItems.length}+</span>
          <span className="menu__stat-lbl">Total Dishes</span>
        </div>
        <div className="menu__stat-divider" />
        <div className="menu__stat">
          <span className="menu__stat-num veg">{menuItems.filter(i=>i.type==='veg').length}</span>
          <span className="menu__stat-lbl">🟢 Veg Items</span>
        </div>
        <div className="menu__stat-divider" />
        <div className="menu__stat">
          <span className="menu__stat-num nonveg">{menuItems.filter(i=>i.type==='non-veg').length}</span>
          <span className="menu__stat-lbl">🔴 Non-Veg Items</span>
        </div>
        <div className="menu__stat-divider" />
        <div className="menu__stat">
          <span className="menu__stat-num">{categories.length - 1}</span>
          <span className="menu__stat-lbl">Categories</span>
        </div>
      </div>

      <div className="menu__body">

        {/* ── SIDEBAR ── */}
        <aside className="menu__sidebar">
          <p className="menu__sidebar-heading">Categories</p>
          <ul className="menu__sidebar-list">
            {categories.map(cat => (
              <li key={cat.key}>
                <button
                  className={`menu__sidebar-btn ${activeCategory === cat.key ? 'menu__sidebar-btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <span className="menu__sidebar-icon">{cat.icon}</span>
                  {cat.label}
                  <span className="menu__sidebar-count">
                    {cat.key === 'all' ? menuItems.length : menuItems.filter(i => i.category === cat.key).length}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="menu__sidebar-heading" style={{ marginTop: '28px' }}>Type</p>
          <div className="menu__type-btns">
            {[
              { key: 'all',     label: 'All',     dot: '' },
              { key: 'veg',     label: 'Veg',     dot: '🟢' },
              { key: 'non-veg', label: 'Non-Veg', dot: '🔴' },
            ].map(t => (
              <button
                key={t.key}
                className={`menu__type-btn ${activeType === t.key ? 'menu__type-btn--active' : ''}`}
                onClick={() => setActiveType(t.key)}
              >
                {t.dot} {t.label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="menu__main">

          {/* Result summary */}
          <div className="menu__result-bar">
            <span className="menu__result-count">
              Showing <strong>{filtered.length}</strong> dishes
              {search && <> for "<em>{search}</em>"</>}
            </span>
            <div className="menu__result-tags">
              {activeCategory !== 'all' && (
                <span className="menu__active-tag">
                  {categories.find(c => c.key === activeCategory)?.label}
                  <button onClick={() => setActiveCategory('all')}>✕</button>
                </span>
              )}
              {activeType !== 'all' && (
                <span className={`menu__active-tag menu__active-tag--${activeType}`}>
                  {activeType === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                  <button onClick={() => setActiveType('all')}>✕</button>
                </span>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="menu__empty">
              <span>🍽️</span>
              <p>No dishes found. Try a different search or filter.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('all'); setActiveType('all'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            grouped.map(group => (
              <div key={group.key} className="menu__section">
                {/* Section header */}
                <div className="menu__section-header">
                  <span className="menu__section-icon">{group.icon}</span>
                  <h2 className="menu__section-title">{group.label}</h2>
                  <span className="menu__section-line" />
                  <span className="menu__section-badge">{group.items.length} items</span>
                </div>

                {/* Cards grid */}
                <div className="menu__grid">
                  {group.items.map((item, i) => (
                    <div
                      key={item.id}
                      className="menu__card"
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      {/* Image */}
                      <div className="menu__card-img-wrap">
                        <img src={item.image} alt={item.name} className="menu__card-img" />
                        {/* Veg / Non-Veg dot */}
                        <span className={`menu__card-dot menu__card-dot--${item.type}`} />
                      </div>
                      {/* Body */}
                      <div className="menu__card-body">
                        <h3 className="menu__card-name">{item.name}</h3>
                        <p className="menu__card-desc">{item.desc}</p>
                        <span className={`menu__card-type menu__card-type--${item.type}`}>
                          {item.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default Menu;