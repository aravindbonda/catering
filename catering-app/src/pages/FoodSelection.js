import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimationControls, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import paneer from '../assets/paneerbutter.png';
import biryani from '../assets/chickenbiryani.png';
import mutton from '../assets/muttonrogan.png';
import sweets from '../assets/rasgullasweet.png';
import veg from '../assets/indiaveg.png';
import food from '../assets/food.png';
import rasgulla from '../assets/rasgullasweet.png';

const locations = ['Hyderabad', 'Eluru', 'Vijayawada', 'Village Location', 'Warangal', 'Guntur'];

const carouselItems = [
  { title: 'Hyderabadi Biryani', image: biryani },
  { title: 'South Indian Meals', image: veg },
  { title: 'Festival Sweets', image: sweets },
  { title: 'Tandoori Starters', image: mutton },
  { title: 'Wedding Buffet', image: food },
  { title: 'Paneer Curry', image: paneer },
  { title: 'Sweet Counter', image: rasgulla }
];

const sampleExtractedItems = [
  { name: 'Chicken Biryani', category: 'Rice & Biryani', quantity: 1, price: 180, suggestedServingCount: 1 },
  { name: 'Paneer Curry', category: 'Main Course', quantity: 1, price: 120, suggestedServingCount: 1 },
  { name: 'Gulab Jamun', category: 'Sweets', quantity: 1, price: 45, suggestedServingCount: 1 },
  { name: 'Ice Cream', category: 'Desserts', quantity: 1, price: 55, suggestedServingCount: 1 },
  { name: 'Tandoori Starter Platter', category: 'Starters', quantity: 1, price: 95, suggestedServingCount: 1 }
];

const fallbackVendors = [
  {
    id: 'vendor-royal',
    name: 'Sri Sai Royal Caterers',
    rating: 4.9,
    price: 'From Rs. 280/plate',
    image: biryani,
    serviceArea: 'Hyderabad, Eluru, Vijayawada',
    experience: '12 years'
  },
  {
    id: 'vendor-veg',
    name: 'Annapurna Veg Events',
    rating: 4.8,
    price: 'From Rs. 210/plate',
    image: veg,
    serviceArea: 'Hyderabad local and nearby towns',
    experience: '9 years'
  },
  {
    id: 'vendor-mithai',
    name: 'Mithai Mandapam',
    rating: 4.7,
    price: 'From Rs. 95/add-on',
    image: sweets,
    serviceArea: 'Weddings and family functions',
    experience: '7 years'
  }
];

const workflow = [
  'Upload menu',
  'Review extracted dishes',
  'Enter guests',
  'Check estimate',
  'Confirm request',
  'Admin review',
  'Vendor assignment',
  'Vendor approval',
  'Payment',
  'Booking confirmed'
];

function AnimatedCurrency({ value }) {
  const amount = useMotionValue(value);
  const spring = useSpring(amount, { stiffness: 85, damping: 20 });
  const display = useTransform(spring, (latest) => `Rs.${Math.round(latest).toLocaleString('en-IN')}`);

  useEffect(() => {
    amount.set(value);
  }, [amount, value]);

  return <motion.span>{display}</motion.span>;
}

function Counter({ label, value, onChange, min = 0 }) {
  return (
    <div className="luxe-card p-4">
      <span className="text-sm font-extrabold text-[#755F54]">{label}</span>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF7EF] text-xl font-extrabold text-[#7A2E1F]" type="button" onClick={() => onChange(Math.max(min, value - 1))}>-</button>
        <strong className="text-3xl text-[#1F1F1F]">{value}</strong>
        <button className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FC8019] text-xl font-extrabold text-white shadow-lg shadow-orange-100" type="button" onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

function FoodSelection() {
  const fileInputRef = useRef(null);
  const sliderControls = useAnimationControls();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialBooking = location.state?.booking || {};

  const [bookingSearch, setBookingSearch] = useState({
    from: initialBooking.from || 'Hyderabad',
    to: initialBooking.to || 'Hyderabad',
    eventDate: initialBooking.eventDate || '',
    eventHallAddress: '',
    guestCount: 100,
    marriageHallLocation: '',
    villageTownDetails: '',
    landmark: '',
    setupTiming: ''
  });
  const [eventDetails, setEventDetails] = useState({
    eventType: 'Wedding',
    eventTime: '',
    specialInstructions: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionState, setExtractionState] = useState('idle');
  const [extractedItems, setExtractedItems] = useState(sampleExtractedItems);
  const [guests, setGuests] = useState({ total: 100, adults: 80, children: 20 });
  const [assignmentPreference, setAssignmentPreference] = useState('admin');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState(fallbackVendors);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLocalBooking = bookingSearch.from === bookingSearch.to;

  useEffect(() => {
    sliderControls.start({
      x: ['0%', '-50%'],
      transition: { duration: 30, ease: 'linear', repeat: Infinity }
    });
  }, [sliderControls]);

  useEffect(() => {
    api.get('/api/partners')
      .then(({ data }) => {
        const approved = (data.partners || [])
          .filter((partner) => partner.status === 'approved')
          .map((partner) => ({
            id: partner._id,
            name: partner.cateringBusinessName || partner.fullName,
            rating: partner.rating || 4.6,
            price: 'Custom quote',
            image: partner.profileImage || biryani,
            serviceArea: partner.serviceAreas?.join(', ') || partner.city,
            experience: partner.experience || 'Experienced team'
          }));
        if (approved.length) setVendors(approved);
      })
      .catch(() => setVendors(fallbackVendors));
  }, []);

  const updateBookingSearch = (event) => {
    setBookingSearch((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const syncGuests = (next) => {
    const total = Math.max(1, next.total ?? next.adults + next.children);
    setGuests({ total, adults: next.adults, children: next.children });
    setBookingSearch((prev) => ({ ...prev, guestCount: total }));
  };

  const handleFiles = (files) => {
    const accepted = Array.from(files).filter((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type));
    if (!accepted.length) {
      setError('Please upload a PDF, JPG, or PNG file.');
      return;
    }

    setError('');
    const previews = accepted.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
    }));
    setUploadedFiles(previews);
    setUploadProgress(0);
    setExtractionState('uploading');

    let progress = 0;
    const timer = setInterval(() => {
      progress += 12;
      setUploadProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(timer);
        setExtractionState('extracting');
        setTimeout(() => {
          setExtractedItems(sampleExtractedItems);
          setExtractionState('done');
        }, 900);
      }
    }, 120);
  };

  const perPlatePrice = useMemo(() => extractedItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [extractedItems]);
  const setupCharges = eventDetails.eventType === 'Wedding' ? 8500 : 5000;
  const transportationCharges = isLocalBooking ? 2500 : 9500;
  const estimatedTotal = perPlatePrice * guests.total + setupCharges + transportationCharges;
  const serviceCharge = Math.round(estimatedTotal * 0.05);
  const gst = Math.round((estimatedTotal + serviceCharge) * 0.05);
  const grandTotal = estimatedTotal + serviceCharge + gst;
  const eventAddress = isLocalBooking
    ? bookingSearch.eventHallAddress
    : [bookingSearch.marriageHallLocation, bookingSearch.villageTownDetails, bookingSearch.landmark].filter(Boolean).join(', ');

  const confirmRequest = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/book' } });
      return;
    }

    if (!uploadedFiles.length) {
      setError('Please upload your menu or event requirement document first.');
      return;
    }

    if (!bookingSearch.eventDate || !eventAddress) {
      setError('Please add the event date and location details.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const selectedVendorId = assignmentPreference === 'manual' && selectedVendor?.id?.length === 24 ? selectedVendor.id : undefined;
      const { data } = await api.post('/api/orders', {
        items: extractedItems,
        aiExtractedItems: extractedItems,
        uploadedFiles,
        guestCount: guests.total,
        adultsCount: guests.adults,
        childrenCount: guests.children,
        eventDate: bookingSearch.eventDate,
        eventTime: eventDetails.eventTime || bookingSearch.setupTiming,
        eventAddress,
        eventType: eventDetails.eventType,
        specialInstructions: eventDetails.specialInstructions,
        assignmentPreference,
        selectedVendorId,
        pricing: {
          perPlatePrice,
          setupCharges,
          transportationCharges,
          serviceCharge,
          gst,
          estimatedTotal,
          grandTotal
        }
      });

      navigate(`/orders/${data.order._id}/confirmed`, { state: { order: data.order } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-wrap">
      <div className="luxe-section rounded-[2rem] p-5 shadow-luxe md:p-7">
        <div className="relative z-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="font-extrabold uppercase tracking-[0.16em] text-[#D9B08C]">Booking Search</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Upload Your Event Menu & Get Smart Catering Quotes
            </h1>
            <p className="mt-4 max-w-2xl leading-8 text-white/72">
              Upload your food menu in PDF or image format. AI will extract the dishes, estimate guest pricing, and help you find the best catering partner.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_0.9fr]">
              <label>
                <span className="mb-1 block text-sm font-bold text-white">From Location</span>
                <select className="input-field rounded-2xl" name="from" value={bookingSearch.from} onChange={updateBookingSearch}>
                  {locations.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-sm font-bold text-white">To Location</span>
                <select className="input-field rounded-2xl" name="to" value={bookingSearch.to} onChange={updateBookingSearch}>
                  {locations.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-sm font-bold text-white">Event Date</span>
                <input className="input-field rounded-2xl" type="date" name="eventDate" value={bookingSearch.eventDate} onChange={updateBookingSearch} min={new Date().toISOString().split('T')[0]} />
              </label>
            </div>

            {isLocalBooking ? (
              <div className="grid gap-3 rounded-[1.5rem] border border-white/20 bg-white/12 p-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <span className="pill bg-white text-[#7A2E1F]">Local catering vendors</span>
                  <p className="mt-2 text-sm leading-6 text-white/72">For {bookingSearch.from} to {bookingSearch.to}, add hall details and guest count.</p>
                </div>
                <input className="input-field" name="eventHallAddress" placeholder="Event hall address" value={bookingSearch.eventHallAddress} onChange={updateBookingSearch} />
                <input className="input-field" name="guestCount" type="number" min="1" placeholder="Guest count" value={bookingSearch.guestCount} onChange={(event) => syncGuests({ ...guests, total: Number(event.target.value) || 1 })} />
              </div>
            ) : (
              <div className="grid gap-3 rounded-[1.5rem] border border-white/20 bg-white/12 p-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <span className="pill bg-white text-[#7A2E1F]">Outstation setup details</span>
                  <p className="mt-2 text-sm leading-6 text-white/72">For {bookingSearch.from} to {bookingSearch.to}, add venue, landmark, and setup timing.</p>
                </div>
                <input className="input-field" name="marriageHallLocation" placeholder="Marriage hall location" value={bookingSearch.marriageHallLocation} onChange={updateBookingSearch} />
                <input className="input-field" name="villageTownDetails" placeholder="Village or town details" value={bookingSearch.villageTownDetails} onChange={updateBookingSearch} />
                <input className="input-field" name="landmark" placeholder="Landmark" value={bookingSearch.landmark} onChange={updateBookingSearch} />
                <input className="input-field" name="setupTiming" placeholder="Catering setup timing" value={bookingSearch.setupTiming} onChange={updateBookingSearch} />
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      <div className="food-slider mt-8 overflow-hidden rounded-[1.75rem] border border-[#EADCCB] bg-white p-4 shadow-soft">
        <motion.div
          className="flex w-max gap-4"
          animate={sliderControls}
          onHoverStart={() => sliderControls.stop()}
          onHoverEnd={() => sliderControls.start({
            x: '-50%',
            transition: { duration: 30, ease: 'linear', repeat: Infinity }
          })}
        >
          {[...carouselItems, ...carouselItems].map((item, index) => (
            <motion.article
              className="w-56 shrink-0 rounded-[1.4rem] border border-[#EADCCB] bg-white p-3 shadow-lg shadow-[#7A2E1F]/10"
              whileHover={{ y: -8, scale: 1.02 }}
              key={`${item.title}-${index}`}
            >
              <img className="h-36 w-full rounded-[1.1rem] object-cover" src={item.image} alt={item.title} />
              <h3 className="mt-3 text-sm font-extrabold text-[#1F1F1F]">{item.title}</h3>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <section className="panel-card md:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Menu upload</p>
                <h2 className="mt-2 text-3xl font-extrabold text-[#1F1F1F]">Upload menu or event requirements</h2>
              </div>
              <button className="btn-primary rounded-2xl" type="button" onClick={() => fileInputRef.current?.click()}>Upload File</button>
            </div>

            <input ref={fileInputRef} className="hidden" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => handleFiles(event.target.files)} />
            <div
              className="mt-5 grid min-h-48 place-items-center rounded-[1.5rem] border-2 border-dashed border-[#D9B08C] bg-[#FFF7EF] p-6 text-center transition hover:bg-[#F5F1EC]"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                handleFiles(event.dataTransfer.files);
              }}
            >
              <div>
                <p className="text-lg font-extrabold text-[#1F1F1F]">Drag and drop PDF, JPG, or PNG files here</p>
                <p className="mt-2 text-sm leading-6 text-[#755F54]">Menus, buffet photos, or requirement documents are accepted.</p>
                <button className="btn-secondary mt-4 rounded-2xl" type="button" onClick={() => fileInputRef.current?.click()}>Browse Files</button>
              </div>
            </div>

            {extractionState !== 'idle' && (
              <div className="mt-5 rounded-2xl bg-[#F5F1EC] p-4">
                <div className="flex justify-between text-sm font-bold text-[#755F54]">
                  <span>{extractionState === 'done' ? 'Menu extracted' : extractionState === 'extracting' ? 'Reading menu' : 'Uploading'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-[#7A2E1F] to-[#FC8019]" animate={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {!!uploadedFiles.length && (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {uploadedFiles.map((file) => (
                  <div className="rounded-2xl border border-[#EADCCB] bg-white p-4 shadow-sm" key={file.name}>
                    {file.previewUrl ? (
                      <img className="h-36 w-full rounded-xl object-cover" src={file.previewUrl} alt={file.name} />
                    ) : (
                      <div className="grid h-36 place-items-center rounded-xl bg-[#F5F1EC] text-sm font-extrabold text-[#755F54]">PDF Preview</div>
                    )}
                    <strong className="mt-3 block truncate text-[#1F1F1F]">{file.name}</strong>
                    <span className="text-xs font-bold text-[#755F54]">{Math.round(file.size / 1024)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="panel-card md:p-6">
            <p className="eyebrow">Smart extraction</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#1F1F1F]">Extracted menu items</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {extractedItems.map((item) => (
                <motion.article className="luxe-card p-5" whileHover={{ y: -5 }} key={item.name}>
                  <span className="pill">{item.category}</span>
                  <h3 className="mt-4 text-xl font-extrabold text-[#1F1F1F]">{item.name}</h3>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div><span className="block text-[#755F54]">Qty</span><strong>{item.quantity}</strong></div>
                    <div><span className="block text-[#755F54]">Plate</span><strong>Rs.{item.price}</strong></div>
                    <div><span className="block text-[#755F54]">Serving</span><strong>{item.suggestedServingCount}x</strong></div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <section className="panel-card md:p-6">
            <p className="eyebrow">Guest count</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#1F1F1F]">How many people are attending?</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Counter label="Total guests" min={1} value={guests.total} onChange={(value) => syncGuests({ ...guests, total: value })} />
              <Counter label="Adults" value={guests.adults} onChange={(value) => syncGuests({ ...guests, adults: value, total: value + guests.children })} />
              <Counter label="Children" value={guests.children} onChange={(value) => syncGuests({ ...guests, children: value, total: guests.adults + value })} />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-[0.8fr_0.7fr_1.5fr]">
              <label>
                <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Event Type</span>
                <select className="input-field rounded-2xl" value={eventDetails.eventType} onChange={(event) => setEventDetails((prev) => ({ ...prev, eventType: event.target.value }))}>
                  <option>Wedding</option>
                  <option>Birthday</option>
                  <option>Corporate</option>
                  <option>Anniversary</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Setup Time</span>
                <input className="input-field rounded-2xl" type="time" value={eventDetails.eventTime} onChange={(event) => setEventDetails((prev) => ({ ...prev, eventTime: event.target.value }))} />
              </label>
              <label>
                <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Event Notes</span>
                <input className="input-field rounded-2xl" placeholder="Service style, counters, spice level..." value={eventDetails.specialInstructions} onChange={(event) => setEventDetails((prev) => ({ ...prev, specialInstructions: event.target.value }))} />
              </label>
            </div>
          </section>
        </div>

        <aside className="grid h-fit gap-6 xl:sticky xl:top-28">
          <section className="panel-card md:p-6">
            <p className="eyebrow">Live estimate</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#1F1F1F]">Price summary</h2>
            <div className="mt-5 rounded-[1.5rem] bg-[#7A2E1F] p-5 text-white">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#D9B08C]">Grand Total</span>
              <strong className="mt-2 block text-4xl"><AnimatedCurrency value={grandTotal} /></strong>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              {[
                ['Per plate price', perPlatePrice],
                ['Catering setup charges', setupCharges],
                ['Transportation charges', transportationCharges],
                ['Estimated total', estimatedTotal],
                ['Service charge', serviceCharge],
                ['GST', gst]
              ].map(([label, value]) => (
                <div className="flex items-center justify-between rounded-2xl bg-[#FFF7EF] px-4 py-3" key={label}>
                  <span className="font-bold text-[#755F54]">{label}</span>
                  <strong className="text-[#1F1F1F]">Rs.{value.toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="panel-card md:p-6">
            <p className="eyebrow">Vendor selection</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#1F1F1F]">Choose how your vendor is assigned</h2>
            <div className="mt-5 grid gap-3">
              <button className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${assignmentPreference === 'admin' ? 'border-[#7A2E1F] bg-[#FFF7EF]' : 'border-[#EADCCB] bg-white'}`} type="button" onClick={() => setAssignmentPreference('admin')}>
                <strong className="block text-[#1F1F1F]">Admin will assign best vendor</strong>
                <span className="mt-1 block text-sm leading-6 text-[#755F54]">Our team reviews your menu, location, guest count, and budget.</span>
              </button>
              <button className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${assignmentPreference === 'manual' ? 'border-[#7A2E1F] bg-[#FFF7EF]' : 'border-[#EADCCB] bg-white'}`} type="button" onClick={() => setAssignmentPreference('manual')}>
                <strong className="block text-[#1F1F1F]">Choose vendor manually</strong>
                <span className="mt-1 block text-sm leading-6 text-[#755F54]">Pick from available catering partners before submitting.</span>
              </button>
            </div>

            {assignmentPreference === 'manual' && (
              <div className="mt-4 grid gap-3">
                {vendors.map((vendor) => (
                  <button className={`rounded-2xl border p-3 text-left transition hover:-translate-y-1 ${selectedVendor?.id === vendor.id ? 'border-[#7A2E1F] bg-[#FFF7EF]' : 'border-[#EADCCB] bg-white'}`} type="button" key={vendor.id} onClick={() => setSelectedVendor(vendor)}>
                    <div className="flex gap-3">
                      <img className="h-20 w-20 rounded-2xl object-cover" src={vendor.image} alt={vendor.name} />
                      <div>
                        <strong className="block text-[#1F1F1F]">{vendor.name}</strong>
                        <span className="mt-1 block text-xs font-bold text-[#7A2E1F]">Rating {vendor.rating} | {vendor.price}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#755F54]">{vendor.serviceArea} | {vendor.experience}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="panel-card md:p-6">
            <p className="eyebrow">Order summary</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#1F1F1F]">Review and confirm</h2>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between"><span className="text-[#755F54]">Route</span><strong>{bookingSearch.from} to {bookingSearch.to}</strong></div>
              <div className="flex justify-between"><span className="text-[#755F54]">Guests</span><strong>{guests.total}</strong></div>
              <div className="flex justify-between"><span className="text-[#755F54]">Menu items</span><strong>{extractedItems.length}</strong></div>
              <div className="flex justify-between"><span className="text-[#755F54]">Vendor</span><strong>{assignmentPreference === 'admin' ? 'Admin assigned' : selectedVendor?.name || 'Select vendor'}</strong></div>
            </div>
            {error && <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
            <button className="btn-primary mt-5 w-full rounded-2xl" type="button" onClick={confirmRequest} disabled={submitting}>
              {submitting ? 'Submitting Request...' : 'Confirm Booking Request'}
            </button>
          </section>
        </aside>
      </div>

      <section className="panel-card mt-8 md:p-6">
        <p className="eyebrow">Order process</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {workflow.map((step, index) => (
            <div className="rounded-2xl bg-[#FFF7EF] p-4 transition hover:-translate-y-1 hover:shadow-soft" key={step}>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#7A2E1F] text-sm font-extrabold text-white">{index + 1}</span>
              <strong className="mt-3 block text-sm text-[#1F1F1F]">{step}</strong>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

export default FoodSelection;
