import { Link, useLocation } from 'react-router-dom';

function OrderConfirmation() {
  const order = useLocation().state?.order;

  return (
    <section className="grid min-h-[75vh] place-items-center px-4 py-12">
      <div className="panel-card w-full max-w-lg text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FFF7EF] text-3xl text-[#7A2E1F]">✓</span>
        <h1 className="mt-5 text-3xl font-extrabold text-[#1F1F1F]">Order Confirmed</h1>
        <p className="mt-3 text-[#755F54]">Your catering booking has been received. The admin team will assign a partner shortly.</p>
        {order && (
          <div className="mt-6 grid gap-3 rounded-2xl bg-[#F5F1EC] p-4 text-left text-sm">
            <span>Order ID: <strong>{order._id}</strong></span>
            <span>Total Plates: <strong>{order.guestCount}</strong></span>
            <span>Total Cost: <strong>Rs.{(order.totalAmount || 0).toLocaleString('en-IN')}</strong></span>
            <span>Status: <strong>{order.status}</strong></span>
          </div>
        )}
        <Link className="btn-primary mt-6 w-full" to="/orders">View Orders</Link>
      </div>
    </section>
  );
}

export default OrderConfirmation;
