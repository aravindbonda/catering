import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/food.png';
import paneer from '../assets/paneerbutter.png';
import biryani from '../assets/chickenbiryani.png';
import veg from '../assets/indiaveg.png';
import sweets from '../assets/gulabjamun.png';
import rasgulla from '../assets/rasgullasweet.png';

const locations = ['Hyderabad', 'Eluru', 'Vijayawada', 'Village Location', 'Warangal', 'Guntur'];

const categories = [
  ['Marriage Catering', 'Full-service wedding menus, counters, transport, and setup teams.', biryani],
  ['Birthday Events', 'Compact packages for homes, halls, gardens, and party venues.', sweets],
  ['Corporate Catering', 'Breakfast, lunch, snack boxes, live counters, and recurring meals.', paneer],
  ['Outdoor Events', 'On-site kitchens, buffet stations, servers, and logistics support.', veg],
  ['Village Functions', 'Long-distance food movement, local setup, and guest planning.', rasgulla],
  ['Bulk Food Orders', 'Large-scale biryani, meals, sweets, and packed food delivery.', heroImage]
];

const aiFeatures = [
  ['AI Menu Extraction', 'Reads menus, PDFs, and handwritten requirement sheets into structured food items.'],
  ['Smart Vendor Matching', 'Ranks verified caterers by cuisine, capacity, route, rating, and availability.'],
  ['AI Budget Prediction', 'Estimates per-guest and total event costs before vendors quote.'],
  ['Smart Requirement Reading', 'Turns menus, guest counts, hall names, timings, and notes into a clear booking brief.'],
  ['Auto Quote Comparison', 'Compares vendor quotes by items, service scope, taxes, and transport fees.']
];

const steps = [
  ['Upload Requirements', 'Add PDFs, menu photos, guest count, route, hall, and event details.'],
  ['AI Processes Data', 'The platform extracts menu items and predicts quantity, budget, and service needs.'],
  ['Vendors Send Quotes', 'Matched vendors receive leads and submit structured quotations.'],
  ['Confirm Booking', 'Compare, pay securely, and track setup, transport, and event execution.']
];

const vendors = [
  {
    name: 'Sri Sai Royal Caterers',
    rating: '4.9',
    image: biryani,
    tags: 'Wedding, Hyderabadi, Non-veg',
    locations: 'Hyderabad, Vijayawada, Eluru',
    price: 'Rs. 280/guest'
  },
  {
    name: 'Annapurna Veg Events',
    rating: '4.8',
    image: veg,
    tags: 'Pure veg, South Indian, Sweets',
    locations: 'Hyderabad, Guntur, Villages',
    price: 'Rs. 210/guest'
  },
  {
    name: 'Mithai Mandapam',
    rating: '4.7',
    image: rasgulla,
    tags: 'Desserts, Snacks, Live counters',
    locations: 'Hyderabad local events',
    price: 'Rs. 95/add-on'
  }
];

const testimonials = [
  ['The route-based booking flow made our Hyderabad to Eluru wedding plan feel simple. Quotes were clear and fast.', 'Priya Reddy', 'Wedding client'],
  ['AI extraction saved us hours. We uploaded our menu PDF and vendors responded with comparable quotations.', 'Arjun Varma', 'Corporate admin'],
  ['Leads are cleaner now because hall details, timing, guest count, and transport notes arrive together.', 'Karthik Foods', 'Verified vendor']
];

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-left">
      <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#755F54]">{label}</span>
      {children}
    </label>
  );
}

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [from, setFrom] = useState('Hyderabad');
  const [to, setTo] = useState('Vijayawada');
  const [eventDate, setEventDate] = useState('');
  const isLocal = from === to;

  const bookingPrompts = useMemo(
    () =>
      isLocal
        ? ['Event hall address', 'Event type', 'Guest count', 'Preferred cuisine']
        : ['Marriage hall details', 'Village or town location', 'Landmark', 'Food transport needs', 'Setup timing', 'Accommodation details'],
    [isLocal]
  );

  const goToBooking = () => {
    const booking = { from, to, eventDate };
    if (user) {
      navigate('/book', { state: { booking } });
      return;
    }

    navigate('/login', { state: { from: '/book', booking } });
  };

  return (
    <>
      <section id="home" className="luxe-section">
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-82px)] max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F6DDC3] shadow-sm backdrop-blur">
              AI-powered B2B catering marketplace
            </div>
            <h1 className="mt-6 max-w-3xl font-sans text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Smart Catering Delivery For Every Event
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              Book verified caterers for local functions or outstation events, upload menus for AI extraction, compare quotes, and manage transport, setup, and payments in one premium flow.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-white/20 bg-white/92 p-3 shadow-luxe backdrop-blur">
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.9fr_auto]">
                <Field label="From">
                  <select className="input-field min-h-14 rounded-2xl" value={from} onChange={(event) => setFrom(event.target.value)}>
                    {locations.map((location) => (
                      <option key={location}>{location}</option>
                    ))}
                  </select>
                </Field>
                <Field label="To">
                  <select className="input-field min-h-14 rounded-2xl" value={to} onChange={(event) => setTo(event.target.value)}>
                    {locations.map((location) => (
                      <option key={location}>{location}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Event Date">
                  <input className="input-field min-h-14 rounded-2xl" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} />
                </Field>
                <button className="btn-primary mt-auto min-h-14 rounded-2xl px-7" type="button" onClick={goToBooking}>Search</button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="btn-primary rounded-2xl" type="button" onClick={goToBooking}>Start Booking</button>
              <Link className="btn-secondary rounded-2xl" to="/register-partner">Join as Vendor</Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {[
                ['24+', 'Verified caterers'],
                ['4.9', 'Avg rating'],
                ['18k+', 'Guests served']
              ].map(([value, label]) => (
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur" key={label}>
                  <strong className="block text-2xl text-white">{value}</strong>
                  <span className="mt-1 block text-xs font-bold text-white/62">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-h-[460px]">
            <div className="float-slow absolute right-4 top-3 rounded-[1.5rem] border border-white/25 bg-white/85 p-3 shadow-luxe backdrop-blur">
              <img className="h-24 w-24 rounded-2xl object-cover" src={paneer} alt="Paneer catering bowl" />
              <p className="mt-2 text-sm font-extrabold text-[#1F1F1F]">Veg Buffet</p>
              <span className="text-xs font-bold text-[#7A2E1F]">Rs. 210/guest</span>
            </div>
            <div className="float-medium absolute left-0 top-28 rounded-[1.5rem] border border-white/25 bg-white/85 p-3 shadow-luxe backdrop-blur">
              <img className="h-24 w-24 rounded-2xl object-cover" src={sweets} alt="Dessert catering card" />
              <p className="mt-2 text-sm font-extrabold text-[#1F1F1F]">Sweet Counter</p>
              <span className="text-xs font-bold text-[#7A2E1F]">Live quote</span>
            </div>
            <div className="float-fast absolute bottom-14 right-0 rounded-[1.5rem] border border-white/25 bg-white/90 p-4 shadow-luxe backdrop-blur">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#755F54]">AI estimate</p>
              <strong className="mt-1 block text-2xl text-[#1F1F1F]">Rs. 1.8L</strong>
              <span className="text-xs font-bold text-[#755F54]">500 guests, 18 items</span>
            </div>
            <div className="relative mx-auto mt-20 max-w-[430px]">
              <div className="rounded-[2.25rem] border border-white/25 bg-white/18 p-5 shadow-luxe backdrop-blur">
                <img className="h-[370px] w-full rounded-[1.75rem] object-cover" src={heroImage} alt="Catering delivery and event food spread" />
              </div>
              <div className="absolute -bottom-8 left-10 right-10 rounded-[1.5rem] border border-[#EADCCB] bg-white p-4 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#755F54]">Matched vendors</p>
                    <strong className="text-xl text-[#1F1F1F]">24 available</strong>
                  </div>
                  <span className="rounded-full bg-[#FFF7EF] px-3 py-2 text-sm font-extrabold text-[#7A2E1F]">4.9 rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section-wrap">
        <div className="luxe-card p-5">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div>
              <p className="eyebrow">RedBus-style booking flow</p>
              <h2 className="mt-2 text-3xl font-black text-[#1F1F1F] md:text-5xl">Plan by route, then collect the right event details</h2>
              <p className="mt-4 leading-7 text-[#755F54]">
                Current route: <strong>{from}</strong> to <strong>{to}</strong>. {isLocal ? 'Local booking mode shows nearby catering vendors.' : 'Outstation booking mode captures transport and venue logistics.'}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {bookingPrompts.map((prompt) => (
                <div className="rounded-3xl border border-[#EADCCB] bg-[#F5F1EC] p-4 transition hover:-translate-y-1 hover:shadow-soft" key={prompt}>
                  <span className="text-sm font-extrabold text-[#1F1F1F]">{prompt}</span>
                  <p className="mt-1 text-sm leading-6 text-[#755F54]">Captured before AI vendor matching and quote requests.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap pt-2">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">Event categories</p>
          <h2 className="mt-2 text-3xl font-black text-[#1F1F1F] md:text-5xl">Every event format, one marketplace</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map(([title, text, image]) => (
            <article className="luxe-card overflow-hidden" key={title}>
              <img className="h-44 w-full object-cover" src={image} alt={title} />
              <div className="p-6">
                <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-[#7A2E1F] to-[#FC8019] shadow-lg shadow-orange-100" />
                <h3 className="text-xl font-extrabold text-[#1F1F1F]">{title}</h3>
                <p className="mt-3 leading-7 text-[#755F54]">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="luxe-section">
        <div className="relative z-10 section-wrap">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="font-extrabold uppercase tracking-[0.16em] text-[#D9B08C]">AI platform layer</p>
              <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">Automation for menus, budgets, and vendor matching</h2>
            </div>
            <button className="btn-secondary rounded-2xl" type="button" onClick={goToBooking}>Find Caterers</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {aiFeatures.map(([title, text]) => (
              <article className="glass-card p-5 transition hover:-translate-y-2" key={title}>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FC8019] text-sm font-extrabold text-white">AI</span>
                <h3 className="mt-5 text-lg font-extrabold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-2 text-3xl font-black text-[#1F1F1F] md:text-5xl">From requirement upload to confirmed booking</h2>
            <p className="mt-5 leading-8 text-[#755F54]">
              Customers can create a request, vendors can respond with clear quotes, and every event stays organized from first search to final confirmation.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map(([title, text], index) => (
              <article className="luxe-card p-6" key={title}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7A2E1F] text-sm font-extrabold text-white">{index + 1}</span>
                <h3 className="mt-5 text-xl font-extrabold text-[#1F1F1F]">{title}</h3>
                <p className="mt-3 leading-7 text-[#755F54]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="vendors" className="bg-white/55">
        <div className="section-wrap">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow">Featured vendors</p>
            <h2 className="mt-2 text-3xl font-black text-[#1F1F1F] md:text-5xl">Verified caterers ready for local and outstation events</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <article className="luxe-card overflow-hidden" key={vendor.name}>
                <img className="h-56 w-full object-cover" src={vendor.image} alt={vendor.name} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-extrabold text-[#1F1F1F]">{vendor.name}</h3>
                    <span className="rounded-full bg-[#FFF7EF] px-3 py-1 text-sm font-extrabold text-[#7A2E1F]">{vendor.rating}</span>
                  </div>
                  <p className="mt-3 text-sm font-bold text-[#7A2E1F]">{vendor.tags}</p>
                  <p className="mt-2 text-sm leading-6 text-[#755F54]">{vendor.locations}</p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <strong className="text-[#1F1F1F]">{vendor.price}</strong>
                    <div className="flex gap-2">
                      <Link className="rounded-full bg-[#FFF7EF] px-3 py-2 text-xs font-extrabold text-[#7A2E1F]" to="/menu">Quick view</Link>
                      <Link className="rounded-full bg-[#FC8019] px-3 py-2 text-xs font-extrabold text-white" to="/book">Compare</Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-wrap">
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map(([quote, name, role]) => (
            <article className="testimonial-card luxe-card p-6" key={name}>
              <p className="text-lg leading-8 text-[#5F4B42]">"{quote}"</p>
              <div className="mt-6">
                <strong className="block text-[#1F1F1F]">{name}</strong>
                <span className="text-sm font-bold text-[#7A2E1F]">{role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap pt-0">
        <div className="luxe-section rounded-[2rem] p-8 shadow-luxe md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative z-10">
              <p className="font-extrabold uppercase tracking-[0.16em] text-[#D9B08C]">Launch your next event</p>
              <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">Book Catering Anywhere In India</h2>
              <p className="mt-4 max-w-2xl leading-8 text-white/72">
                Book trusted catering services for weddings, events, and functions anywhere in India.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-3 lg:justify-end">
              <button className="btn-primary rounded-2xl" type="button" onClick={goToBooking}>Start Booking</button>
              <Link className="btn-glass rounded-2xl" to="/login">Login</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
