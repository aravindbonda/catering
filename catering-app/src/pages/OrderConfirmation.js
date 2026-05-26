import { Link, useLocation } from 'react-router-dom';

function OrderConfirmation() {
  const order = useLocation().state?.order;

  return (
    <section className="grid min-h-[75vh] place-items-center px-4 py-12">
      <div className="panel-card w-full max-w-lg text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-saffron-50 text-3xl text-saffron-700">✓</span>
        <h1 className="mt-5 text-3xl font-extrabold">Order Confirmed</h1>
        <p className="mt-3 text-stone-600">Your catering booking has been received. The admin team will assign a partner shortly.</p>
        {order && (
          <div className="mt-6 grid gap-3 rounded-xl bg-[#F8F8F8] p-4 text-left text-sm">
            <span>Order ID: <strong>{order._id}</strong></span>
            <span>Total Plates: <strong>{order.attendees}</strong></span>
            <span>Total Cost: <strong>Rs.{order.totalCost}</strong></span>
            <span>Status: <strong>{order.status}</strong></span>
          </div>
        )}
        <Link className="btn-primary mt-6 w-full" to="/orders">View Orders</Link>
      </div>
    </section>
  );
}

export default OrderConfirmation;
