import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const roles = [
  {
    id: 'user',
    label: 'User Login',
    title: 'Book catering',
    text: 'Select menus, manage your plate, and track confirmed orders.',
    accent: 'from-[#FC8019] to-[#D9B08C]'
  },
  {
    id: 'admin',
    label: 'Admin Login',
    title: 'Manage platform',
    text: 'Approve partners, assign orders, monitor users, and review analytics.',
    accent: 'from-[#7A2E1F] to-[#FC8019]'
  },
  {
    id: 'partner',
    label: 'Partner Login',
    title: 'Serve events',
    text: 'View assigned orders, update status, reviews, earnings, and calendar.',
    accent: 'from-[#2B110C] to-[#7A2E1F]'
  }
];

function Login() {
  const [activeTab, setActiveTab] = useState('user');
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, saveSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      let account;
      if (activeTab === 'admin') {
        const { data } = await api.post('/api/auth/admin-login', { email: form.identifier, password: form.password });
        saveSession(data);
        account = data.user;
      } else if (activeTab === 'partner') {
        const { data } = await api.post('/api/auth/partner-login', form);
        saveSession({ token: data.token, user: data.partner });
        account = data.partner;
      } else {
        account = await login(form);
      }

      const requestedPath = location.state?.from?.pathname || location.state?.from || null;
      const dashboardPath = account.role === 'admin' ? '/admin' : account.role === 'partner' ? '/partner' : '/orders';
      navigate(requestedPath || dashboardPath, {
        replace: true,
        state: location.state?.booking ? { booking: location.state.booking } : undefined
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const activeRole = roles.find((role) => role.id === activeTab);

  return (
    <section className="section-wrap">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="luxe-section rounded-[2rem] p-8 text-white shadow-luxe md:p-10">
          <div className="relative z-10">
          <p className="font-bold uppercase tracking-[0.16em] text-[#D9B08C]">Secure access</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Sign in by role and continue your catering workflow</h1>
          <p className="mt-5 leading-8 text-white/75">
            Customers book food, partners manage assigned events, and teams keep every catering request organized from one account.
          </p>
          <div className="mt-8 grid gap-3">
            {roles.map((role) => (
              <button
                className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${
                  activeTab === role.id ? 'border-[#D9B08C] bg-white text-[#1F1F1F] shadow-xl' : 'border-white/15 bg-white/10 text-white'
                }`}
                key={role.id}
                onClick={() => setActiveTab(role.id)}
                type="button"
              >
                <span className={`mb-3 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${role.accent} text-sm font-extrabold text-white`}>
                  {role.label.charAt(0)}
                </span>
                <strong className="block text-lg">{role.title}</strong>
                <span className={`mt-1 block text-sm leading-6 ${activeTab === role.id ? 'text-[#755F54]' : 'text-white/75'}`}>{role.text}</span>
              </button>
            ))}
          </div>
          </div>
        </div>

        <div className="panel-card p-6 md:p-8">
          <div className="mb-6">
            <p className="eyebrow">{activeRole.label}</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#1F1F1F]">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-[#755F54]">Use your registered credentials to access the right dashboard.</p>
          </div>

          <div className="mb-6 grid gap-2 rounded-2xl bg-[#F5F1EC] p-1 sm:grid-cols-3">
            {roles.map((role) => (
              <button
                className={`rounded-xl px-3 py-3 text-sm font-extrabold transition ${activeTab === role.id ? 'bg-white text-[#7A2E1F] shadow-sm' : 'text-[#755F54] hover:text-[#1F1F1F]'}`}
                key={role.id}
                onClick={() => setActiveTab(role.id)}
                type="button"
              >
                {role.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Email</span>
                <input
                  className="input-field"
                  type="email"
                  placeholder="Enter email"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Password</span>
                <input
                  className="input-field"
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </label>
            </div>

            {activeTab === 'admin' && (
              <div className="mt-4 rounded-2xl border border-[#EADCCB] bg-[#FFF7EF] p-4 text-sm leading-6 text-[#1F1F1F]">
                <strong>Admin demo credentials</strong>
                <br />
                Email: admin@catering.com
                <br />
                Password: admin123
              </div>
            )}

            <button className="btn-primary mt-6 w-full" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : `Sign in as ${activeRole.title}`}
            </button>
          </form>

          <div className="mt-6 grid gap-2 text-center text-sm text-[#755F54]">
            {activeTab === 'user' && (
              <>
                <p>New customer? <Link className="font-bold text-[#7A2E1F] hover:text-[#FC8019]" to="/register">Create account</Link></p>
                <Link className="font-bold text-[#7A2E1F] hover:text-[#FC8019]" to="/forgot-password">Forgot password?</Link>
              </>
            )}
            {activeTab === 'partner' && (
              <p>Run a catering business? <Link className="font-bold text-[#7A2E1F] hover:text-[#FC8019]" to="/register-partner">Register as partner</Link></p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
