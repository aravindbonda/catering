import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const initial = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  primaryEventLocation: '',
  preferredCity: '',
  userType: 'Event Organizer'
};

function Register() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/api/auth/register', form);
      navigate('/verify-otp', { state: { identifier: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="grid min-h-[75vh] place-items-center px-4 py-12">
      <form className="panel-card w-full max-w-2xl p-6 md:p-8" onSubmit={submit}>
        <p className="eyebrow">Customer Registration</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#1F1F1F] md:text-4xl">Create your catering account</h1>
        <p className="mt-3 text-sm leading-6 text-[#755F54]">
          Register with your email, verify the one-time code, and continue to your booking dashboard.
        </p>
        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Full Name</span>
            <input className="input-field" name="fullName" placeholder="Enter full name" value={form.fullName} onChange={update} required />
          </label>
          <label>
            <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Email Address</span>
            <input className="input-field" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={update} required />
          </label>
          <label>
            <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Password</span>
            <input className="input-field" name="password" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={update} minLength="8" required />
          </label>
          <label>
            <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Confirm Password</span>
            <input className="input-field" name="confirmPassword" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={update} minLength="8" required />
          </label>
          <label>
            <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Primary Event Location</span>
            <input className="input-field" name="primaryEventLocation" placeholder="Hall, area, or address" value={form.primaryEventLocation} onChange={update} required />
          </label>
          <label>
            <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">Preferred City</span>
            <input className="input-field" name="preferredCity" placeholder="Hyderabad" value={form.preferredCity} onChange={update} required />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-bold text-[#1F1F1F]">User Type</span>
            <select className="input-field" name="userType" value={form.userType} onChange={update}>
              <option>Event Organizer</option>
              <option>Wedding Planner</option>
              <option>Corporate User</option>
            </select>
          </label>
        </div>
        <button className="btn-primary mt-6 w-full rounded-2xl" type="submit">Register & Verify Email</button>
      </form>
    </section>
  );
}

export default Register;
