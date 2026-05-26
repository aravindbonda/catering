import { useEffect, useState } from 'react';
import api from '../services/api';

const statuses = ['Admin Review', 'Pending', 'Accepted', 'Preparing', 'Out for Service', 'Payment Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];

function AdminDashboard() {
  const [active, setActive] = useState('Dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState('');
  const [partnerForm, setPartnerForm] = useState({ name: '', email: '', phone: '', location: '', type: 'Both' });

  const load = async () => {
    setError('');
    try {
      const [dashboardRes, usersRes, ordersRes, partnersRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/users'),
        api.get('/api/admin/orders'),
        api.get('/api/partners')
      ]);
      setStats(dashboardRes.data.stats);
      setUsers(usersRes.data.users);
      setOrders(ordersRes.data.orders);
      setPartners(partnersRes.data.partners);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin data');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createPartner = async (event) => {
    event.preventDefault();
    await api.post('/api/partners', partnerForm);
    setPartnerForm({ name: '', email: '', phone: '', location: '', type: 'Both' });
    load();
  };

  const updateStatus = async (orderId, status) => {
    await api.patch(`/api/admin/orders/${orderId}/status`, { status });
    load();
  };

  const assignPartner = async (orderId, partnerId) => {
    if (!partnerId) return;
    await api.patch(`/api/admin/orders/${orderId}/assign-partner`, { partnerId });
    load();
  };

  const updatePricing = async (orderId, pricing) => {
    await api.patch(`/api/admin/orders/${orderId}/pricing`, pricing);
    load();
  };

  const notifications = users.slice(0, 6).map((user) => ({
    id: user._id,
    text: `${user.fullName} registered as a new customer`,
    date: new Date(user.createdAt).toLocaleDateString()
  }));

  return (
    <section className="section-wrap">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="panel-card h-fit lg:sticky lg:top-28">
          <h1 className="text-2xl font-extrabold text-[#282C3F]">Admin Panel</h1>
          <div className="mt-5 grid gap-2">
            {['Dashboard', 'Users', 'Notifications'].map((item) => (
              <button className={`rounded-xl px-4 py-3 text-left text-sm font-bold transition hover:-translate-y-0.5 ${active === item ? 'bg-saffron-600 text-white shadow-lg shadow-orange-100' : 'bg-[#F8F8F8] text-[#686B78] hover:bg-saffron-50 hover:text-saffron-700'}`} key={item} onClick={() => setActive(item)} type="button">
                {item}
              </button>
            ))}
          </div>
        </aside>

        <div className="grid gap-6">
          <div className="rounded-2xl bg-[#282C3F] p-6 text-white shadow-soft">
            <p className="font-bold uppercase text-orange-100">Dashboard</p>
            <h2 className="mt-2 text-3xl font-extrabold">Catering operations overview</h2>
          </div>
          {error && <div className="rounded-lg bg-red-50 p-4 font-semibold text-red-700">{error}</div>}

          {active === 'Dashboard' && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Stat label="Total users" value={stats.totalUsers || 0} />
                <Stat label="Active users" value={stats.activeUsers || 0} />
                <Stat label="Paid users" value={stats.paidUsers || 0} />
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <div className="panel-card">
                  <h3 className="text-xl font-bold">Add Catering Partner</h3>
                  <p className="mt-2 text-sm text-stone-500">If email is provided, the partner can login with Partner@123.</p>
                  <form className="mt-4 grid gap-3" onSubmit={createPartner}>
                    <input className="input-field" placeholder="Name" value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} required />
                    <input className="input-field" type="email" placeholder="Email" value={partnerForm.email} onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })} />
                    <input className="input-field" placeholder="Phone" value={partnerForm.phone} onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })} required />
                    <input className="input-field" placeholder="Location" value={partnerForm.location} onChange={(e) => setPartnerForm({ ...partnerForm, location: e.target.value })} required />
                    <select className="input-field" value={partnerForm.type} onChange={(e) => setPartnerForm({ ...partnerForm, type: e.target.value })}>
                      <option>Both</option>
                      <option>Veg</option>
                      <option>Non-Veg</option>
                    </select>
                    <button className="btn-primary" type="submit">Save Partner</button>
                  </form>
                </div>

                <OrdersTable orders={orders} partners={partners} assignPartner={assignPartner} updateStatus={updateStatus} updatePricing={updatePricing} />
              </div>
              <UsersTable users={users.slice(0, 5)} title="Recent Users" compact />
            </>
          )}

          {active === 'Users' && (
            <UsersTable users={users} title="User Management" />
          )}

          {active === 'Notifications' && (
            <div className="panel-card">
              <h3 className="text-xl font-bold">New Registration Notifications</h3>
              <div className="mt-4 grid gap-3">
                {notifications.map((note) => (
                  <div className="rounded-lg border border-orange-100 bg-saffron-50 p-4" key={note.id}>
                    <p className="font-bold text-stone-800">{note.text}</p>
                    <p className="mt-1 text-sm text-stone-500">{note.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="panel-card">
      <span className="text-sm font-bold uppercase text-stone-500">{label}</span>
      <strong className="mt-2 block text-4xl text-saffron-600">{value}</strong>
    </div>
  );
}

function UsersTable({ users, title, compact = false }) {
  return (
    <div className="panel-card overflow-x-auto">
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-[#F8F8F8] text-[#686B78]">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Preferred City</th>
            <th className="p-4">Role</th>
            {!compact && <th className="p-4">Address</th>}
            <th className="p-4">Verified</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-t border-stone-100" key={user._id}>
              <td className="p-4 font-bold">{user.fullName}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.preferredCity || '-'}</td>
              <td className="p-4 capitalize">{user.role}</td>
              {!compact && <td className="p-4">{user.address}</td>}
              <td className="p-4">{user.isVerified ? 'Yes' : 'No'}</td>
            </tr>
          ))}
          {!users.length && (
            <tr>
              <td className="p-6 text-stone-500" colSpan={compact ? 5 : 6}>No users found yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function OrdersTable({ orders, partners, assignPartner, updateStatus, updatePricing }) {
  return (
    <div className="panel-card overflow-x-auto">
      <h3 className="mb-4 text-xl font-bold">Booking Requests & Partner Assignment</h3>
      <table className="w-full min-w-[1180px] text-left text-sm">
        <thead className="bg-[#F8F8F8] text-[#686B78]">
          <tr>
            <th className="p-4">Order</th>
            <th className="p-4">User</th>
            <th className="p-4">Menu</th>
            <th className="p-4">Guests</th>
            <th className="p-4">Location</th>
            <th className="p-4">Budget</th>
            <th className="p-4">Files</th>
            <th className="p-4">Partner</th>
            <th className="p-4">Status</th>
            <th className="p-4">Service Charge</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr className="border-t border-stone-100" key={order._id}>
              <td className="p-4 font-bold">{order._id.slice(-8)}</td>
              <td className="p-4">{order.userId?.fullName}</td>
              <td className="p-4">
                <div className="max-w-52">
                  <strong className="block">{order.items?.length || 0} extracted items</strong>
                  <span className="mt-1 block truncate text-xs text-stone-500">
                    {(order.aiExtractedItems || order.items || []).map((item) => item.name).slice(0, 3).join(', ')}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <strong>{order.guestCount}</strong>
                <span className="block text-xs text-stone-500">{order.adultsCount || 0} adults, {order.childrenCount || 0} children</span>
              </td>
              <td className="p-4 max-w-56 truncate">{order.eventAddress}</td>
              <td className="p-4 font-bold">Rs.{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
              <td className="p-4">
                <div className="grid gap-1">
                  {(order.uploadedFiles || []).slice(0, 2).map((file) => (
                    <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-bold text-saffron-700" key={file.name}>{file.name}</span>
                  ))}
                  {!order.uploadedFiles?.length && <span className="text-xs text-stone-400">No files</span>}
                </div>
              </td>
              <td className="p-4">
                <select className="input-field" value={order.partnerId?._id || ''} onChange={(e) => assignPartner(order._id, e.target.value)}>
                  <option value="">Assign</option>
                  {partners.map((partner) => <option key={partner._id} value={partner._id}>{partner.cateringBusinessName || partner.fullName || partner.name}</option>)}
                </select>
              </td>
              <td className="p-4">
                <select className="input-field" value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </td>
              <td className="p-4">
                <div className="flex min-w-44 gap-2">
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    defaultValue={order.pricing?.serviceCharge || 0}
                    onBlur={(event) => updatePricing(order._id, {
                      ...order.pricing,
                      serviceCharge: Number(event.target.value),
                      grandTotal: (order.totalAmount || 0) - (order.pricing?.serviceCharge || 0) + Number(event.target.value)
                    })}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
