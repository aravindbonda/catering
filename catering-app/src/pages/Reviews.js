import { useEffect, useState } from 'react';
import api from '../services/api';

function Reviews() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ orderId: '', rating: 5, comment: '' });
  const [message, setMessage] = useState('');

  const load = async () => {
    const [ordersRes, reviewsRes] = await Promise.all([api.get('/api/orders/my'), api.get('/api/reviews')]);
    setOrders((ordersRes.data.orders || []).filter((order) => order.partnerId));
    setReviews(reviewsRes.data.reviews || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post('/api/reviews', form);
    setForm({ orderId: '', rating: 5, comment: '' });
    setMessage('Review submitted');
    load();
  };

  return (
    <section className="section-wrap">
      <div className="luxe-section rounded-[2rem] p-8 text-white shadow-luxe"><div className="relative z-10"><p className="font-bold uppercase text-[#D9B08C]">Reviews</p><h1 className="mt-2 text-4xl font-extrabold">Review your catering partner</h1></div></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form className="panel-card grid gap-4" onSubmit={submit}>
          <select className="input-field" value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })} required><option value="">Choose assigned order</option>{orders.map((order) => <option key={order._id} value={order._id}>{order._id.slice(-8)} - {order.partnerId?.cateringBusinessName}</option>)}</select>
          <input className="input-field" type="number" min="1" max="5" value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })} />
          <textarea className="input-field min-h-32" placeholder="Share your experience" value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} />
          <button className="btn-primary" type="submit">Submit Review</button>
          {message && <p className="font-bold text-[#7A2E1F]">{message}</p>}
        </form>
        <section className="panel-card"><h2 className="text-2xl font-extrabold">Recent Reviews</h2>{reviews.map((review) => <article className="mt-4 rounded-2xl bg-[#FFF7EF] p-4" key={review._id}><strong>{review.partnerId?.cateringBusinessName || review.partnerId?.fullName}</strong><p className="text-[#7A2E1F]">Rating {review.rating}/5</p><p className="mt-1 text-[#755F54]">{review.comment || 'No comment added.'}</p></article>)}</section>
      </div>
    </section>
  );
}

export default Reviews;
