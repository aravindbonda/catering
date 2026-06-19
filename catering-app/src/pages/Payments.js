import { useEffect, useState } from 'react';
import api from '../services/api';

function Payments() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  const load = async () => {
    const [ordersRes, paymentsRes] = await Promise.all([api.get('/api/orders/my'), api.get('/api/payments/my')]);
    setOrders(ordersRes.data.orders || []);
    setPayments(paymentsRes.data.payments || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const pay = async (orderId) => {
    await api.post('/api/payments/mock', { orderId, method: 'Mock' });
    load();
  };

  return (
    <section className="section-wrap">
      <div className="luxe-section rounded-[2rem] p-8 text-white shadow-luxe"><div className="relative z-10"><p className="font-bold uppercase text-[#D9B08C]">Payments</p><h1 className="mt-2 text-4xl font-extrabold">Mock payment center</h1></div></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel-card"><h2 className="text-2xl font-extrabold">Pending Orders</h2>{orders.map((order) => <div className="mt-4 rounded-2xl border border-[#EADCCB] p-4" key={order._id}><strong>{order._id.slice(-8)}</strong><p className="text-[#755F54]">Rs.{(order.totalAmount || 0).toLocaleString('en-IN')} - {order.paymentStatus}</p><button className="btn-primary mt-3" type="button" onClick={() => pay(order._id)} disabled={order.paymentStatus === 'Paid'}>{order.paymentStatus === 'Paid' ? 'Paid' : 'Pay Mock'}</button></div>)}</section>
        <section className="panel-card"><h2 className="text-2xl font-extrabold">Payment History</h2>{payments.map((payment) => <div className="mt-4 rounded-2xl bg-[#FFF7EF] p-4" key={payment._id}><strong>{payment.transactionId}</strong><p className="text-[#755F54]">Rs.{payment.amount} - {payment.status}</p></div>)}</section>
      </div>
    </section>
  );
}

export default Payments;
