import { Link } from 'react-router-dom';
import Orders from './Orders';

function UserDashboard() {
  return (
    <section className="section-wrap">
      <div className="luxe-section mb-8 rounded-[2rem] p-8 text-white shadow-luxe">
        <div className="relative z-10">
          <p className="font-bold uppercase tracking-[0.16em] text-[#D9B08C]">User Dashboard</p>
          <h1 className="mt-2 text-4xl font-extrabold">Plan, book, pay, track, and review</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/book">Create Event Booking</Link>
            <Link className="btn-secondary" to="/menu-upload">Upload Menu</Link>
            <Link className="btn-secondary" to="/track-order">Track Order</Link>
            <Link className="btn-secondary" to="/payments">Payments</Link>
            <Link className="btn-secondary" to="/reviews">Reviews</Link>
          </div>
        </div>
      </div>
      <Orders />
    </section>
  );
}

export default UserDashboard;
