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
      <div className="mb-8 rounded-2xl bg-[#282C3F] p-6 text-white shadow-soft">
        <p className="font-bold uppercase text-orange-100">Partner Panel</p>
        <h1 className="mt-2 text-3xl font-extrabold">{partner?.name || 'Catering Partner'}</h1>
        <p className="mt-2 text-white/75">Assigned catering orders and customer event details.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E9E9EB] bg-white shadow-soft">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-[#F8F8F8] text-[#686B78]">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Email</th>
              <th className="p-4">Guests</th>
              <th className="p-4">Address</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="border-t border-stone-100" key={order._id}>
                <td className="p-4 font-bold">{order._id.slice(-8)}</td>
                <td className="p-4">{order.userId?.fullName}</td>
                <td className="p-4">{order.userId?.email}</td>
                <td className="p-4">{order.attendees}</td>
                <td className="p-4">{order.eventAddress || order.userId?.functionAddress}</td>
                <td className="p-4"><span className="rounded-full bg-saffron-50 px-3 py-1 text-xs font-bold text-saffron-700">{order.status}</span></td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td className="p-6 text-stone-500" colSpan="6">No assigned orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PartnerDashboard;
