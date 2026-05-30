import { useEffect, useState } from 'react';
import api from '../services/api';

function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/api/partners/my-orders').then(({ data }) => {
      setPartner(data.partner);
      setOrders(data.orders);
    });
  }, []);

  return (
    <section className="section-wrap">
      <div className="luxe-section mb-8 rounded-[2rem] p-8 text-white shadow-luxe">
        <div className="relative z-10">
          <p className="font-bold uppercase text-[#D9B08C]">Partner Panel</p>
          <h1 className="mt-2 text-3xl font-extrabold">{partner?.name || partner?.cateringBusinessName || 'Catering Partner'}</h1>
          <p className="mt-2 text-white/75">Assigned catering orders and customer event details.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <article className="luxe-card p-5" key={order._id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#755F54]">Order</p>
                <h2 className="mt-1 text-2xl font-black text-[#7A2E1F]">{order._id.slice(-8)}</h2>
              </div>
              <span className="rounded-full bg-[#FFF7EF] px-3 py-1 text-xs font-extrabold text-[#7A2E1F]">{order.status}</span>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="rounded-2xl bg-[#F5F1EC] p-4">
                <span className="block text-xs font-bold uppercase text-[#755F54]">Customer</span>
                <strong className="mt-1 block text-[#1F1F1F]">{order.userId?.fullName || 'Customer'}</strong>
                <span className="mt-1 block text-[#755F54]">{order.userId?.email}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#FFF7EF] p-4">
                  <span className="block text-xs font-bold uppercase text-[#755F54]">Guests</span>
                  <strong className="mt-1 block text-[#1F1F1F]">{order.attendees || order.guestCount || '-'}</strong>
                </div>
                <div className="rounded-2xl bg-[#FFF7EF] p-4">
                  <span className="block text-xs font-bold uppercase text-[#755F54]">Status</span>
                  <strong className="mt-1 block text-[#1F1F1F]">{order.status}</strong>
                </div>
              </div>
              <div className="rounded-2xl border border-[#EADCCB] p-4">
                <span className="block text-xs font-bold uppercase text-[#755F54]">Address</span>
                <p className="mt-1 leading-6 text-[#1F1F1F]">{order.eventAddress || order.userId?.functionAddress || 'Address pending'}</p>
              </div>
            </div>
          </article>
        ))}
        {!orders.length && (
          <div className="panel-card md:col-span-2 xl:col-span-3">
            <div className="animate-pulse rounded-3xl bg-[#F5F1EC] p-8 text-center font-bold text-[#755F54]">
              No assigned orders yet.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PartnerDashboard;
