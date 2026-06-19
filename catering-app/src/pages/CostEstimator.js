import { useState } from 'react';
import api from '../services/api';

const initialItems = [
  { name: 'Chicken Biryani', category: 'Rice & Biryani', quantity: 1, price: 180 },
  { name: 'Paneer Butter Masala', category: 'Main Course', quantity: 1, price: 130 },
  { name: 'Gulab Jamun', category: 'Desserts', quantity: 1, price: 45 }
];

function CostEstimator() {
  const [guestCount, setGuestCount] = useState(100);
  const [eventType, setEventType] = useState('Wedding');
  const [isLocal, setIsLocal] = useState(true);
  const [pricing, setPricing] = useState(null);

  const estimate = async () => {
    const { data } = await api.post('/api/uploads/estimate', { items: initialItems, guestCount, eventType, isLocal });
    setPricing(data.pricing);
  };

  return (
    <section className="section-wrap">
      <div className="luxe-section rounded-[2rem] p-8 text-white shadow-luxe"><div className="relative z-10"><p className="font-bold uppercase text-[#D9B08C]">Cost Estimator</p><h1 className="mt-2 text-4xl font-extrabold">Estimate catering cost</h1></div></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel-card grid gap-4">
          <label><span className="mb-1 block font-bold">Guest Count</span><input className="input-field" type="number" min="1" value={guestCount} onChange={(event) => setGuestCount(Number(event.target.value) || 1)} /></label>
          <label><span className="mb-1 block font-bold">Event Type</span><select className="input-field" value={eventType} onChange={(event) => setEventType(event.target.value)}><option>Wedding</option><option>Birthday</option><option>Corporate</option><option>Anniversary</option><option>Other</option></select></label>
          <label className="flex items-center gap-3 font-bold text-[#755F54]"><input type="checkbox" checked={isLocal} onChange={(event) => setIsLocal(event.target.checked)} /> Local event location</label>
          <button className="btn-primary" type="button" onClick={estimate}>Calculate Estimate</button>
        </section>
        <section className="panel-card">
          <p className="eyebrow">Sample menu</p>
          {initialItems.map((item) => <div className="mt-3 flex justify-between rounded-2xl bg-[#FFF7EF] p-4" key={item.name}><strong>{item.name}</strong><span>Rs.{item.price}</span></div>)}
          {pricing && <div className="mt-5 rounded-[1.5rem] bg-[#7A2E1F] p-5 text-white"><span className="text-sm uppercase text-[#D9B08C]">Grand Total</span><strong className="mt-2 block text-4xl">Rs.{pricing.grandTotal.toLocaleString('en-IN')}</strong></div>}
        </section>
      </div>
    </section>
  );
}

export default CostEstimator;
