import { useEffect, useState } from 'react';
import api from '../services/api';

function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/orders/my').then(({ data }) => {
      setOrders(data.orders || []);
      if (data.orders?.[0]) setOrderId(data.orders[0]._id);
    }).catch(() => {});
  }, []);

  const load = async () => {
    if (!orderId) return;
    setError('');
    try {
      const { data } = await api.get('/api/tracking/' + orderId);
      setTracking(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tracking');
    }
  };

  return (
    <section className="section-wrap">
      <div className="luxe-section rounded-[2rem] p-8 text-white shadow-luxe"><div className="relative z-10"><p className="font-bold uppercase text-[#D9B08C]">Track Order</p><h1 className="mt-2 text-4xl font-extrabold">Follow every booking stage</h1></div></div>
      <div className="mt-8 panel-card">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <select className="input-field" value={orderId} onChange={(event) => setOrderId(event.target.value)}><option value="">Select order</option>{orders.map((order) => <option key={order._id} value={order._id}>{order._id.slice(-8)} - {order.status}</option>)}</select>
          <button className="btn-primary" type="button" onClick={load}>Track</button>
        </div>
        {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 font-bold text-red-700">{error}</div>}
        {tracking && <div className="mt-6 grid gap-4"><h2 className="text-2xl font-extrabold text-[#7A2E1F]">Current Status: {tracking.tracking.currentStatus}</h2>{tracking.tracking.steps.map((step, index) => <div className="rounded-2xl border border-[#EADCCB] bg-[#FFF7EF] p-4" key={index}><strong>{step.status}</strong><p className="mt-1 text-sm text-[#755F54]">{step.note}</p></div>)}</div>}
      </div>
    </section>
  );
}

export default TrackOrder;
