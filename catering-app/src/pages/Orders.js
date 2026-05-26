import { useEffect, useState } from 'react';
import api from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/api/orders/my').then(({ data }) => setOrders(data.orders));
  }, []);

  return (
    <section className="section-wrap">
      <div className="mb-8">
        <p className="font-bold uppercase text-saffron-600">Orders</p>
        <h1 className="mt-2 text-4xl font-extrabold text-stone-950">My Orders</h1>
        <p className="mt-3 text-stone-600">Track confirmations, partner assignment, and fulfillment status.</p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#E9E9EB] bg-white shadow-soft">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="bg-[#F8F8F8] text-[#686B78]">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Food</th>
              <th className="p-4">Attendees</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Partner</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="border-t border-stone-100" key={order._id}>
                <td className="p-4 font-bold">{order._id.slice(-8)}</td>
                <td className="p-4">{order.foodType}</td>
                <td className="p-4">{order.attendees}</td>
                <td className="p-4 font-bold">Rs.{order.totalCost}</td>
                <td className="p-4"><span className="rounded-full bg-saffron-50 px-3 py-1 text-xs font-bold text-saffron-700">{order.status}</span></td>
                <td className="p-4">{order.partnerId?.name || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Orders;
