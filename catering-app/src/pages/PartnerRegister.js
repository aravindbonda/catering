import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const initial = {
  fullName: '',
  email: '',
  phone: '',
  village: '',
  city: '',
  fullAddress: '',
  cateringBusinessName: '',
  serviceAreas: '',
  experience: '',
  password: '',
  confirmPassword: ''
};

function PartnerRegister() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const partnerData = {
        ...form,
        serviceAreas: form.serviceAreas.split(',').map(area => area.trim())
      };
      delete partnerData.confirmPassword;

      await api.post('/api/auth/register-partner', partnerData);
      navigate('/verify-partner-otp', {
        state: {
          identifier: form.email,
          type: 'partner'
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[80vh] place-items-center px-4 py-12">
      <form className="panel-card w-full max-w-4xl" onSubmit={submit}>
        <div className="text-center">
          <p className="eyebrow">Partner Registration</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#1F1F1F]">Join CaterBliss Network</h1>
          <p className="mt-2 text-sm text-[#755F54]">Register your catering business and start receiving orders</p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Personal Information */}
          <div className="md:col-span-2">
            <h3 className="mb-3 text-lg font-extrabold text-[#7A2E1F]">Personal Information</h3>
          </div>

          <input
            className="input-field"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={update}
            required
          />
          <input
            className="input-field"
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={update}
            required
          />
          <input
            className="input-field"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={update}
            required
          />

          {/* Business Information */}
          <div className="md:col-span-2 mt-4">
            <h3 className="mb-3 text-lg font-extrabold text-[#7A2E1F]">Business Information</h3>
          </div>

          <input
            className="input-field"
            name="cateringBusinessName"
            placeholder="Catering Business Name"
            value={form.cateringBusinessName}
            onChange={update}
            required
          />
          <input
            className="input-field"
            name="experience"
            placeholder="Years of Experience"
            value={form.experience}
            onChange={update}
            required
          />

          {/* Location Information */}
          <div className="md:col-span-2 mt-4">
            <h3 className="mb-3 text-lg font-extrabold text-[#7A2E1F]">Service Location</h3>
          </div>

          <input
            className="input-field"
            name="village"
            placeholder="Village/Locality"
            value={form.village}
            onChange={update}
            required
          />
          <input
            className="input-field"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={update}
            required
          />
          <textarea
            className="input-field min-h-24 md:col-span-2"
            name="fullAddress"
            placeholder="Full Business Address"
            value={form.fullAddress}
            onChange={update}
            required
          />
          <input
            className="input-field md:col-span-2"
            name="serviceAreas"
            placeholder="Service Areas (comma-separated, e.g., Mumbai, Pune, Thane)"
            value={form.serviceAreas}
            onChange={update}
            required
          />

          {/* Account Security */}
          <div className="md:col-span-2 mt-4">
            <h3 className="mb-3 text-lg font-extrabold text-[#7A2E1F]">Account Security</h3>
          </div>

          <input
            className="input-field"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update}
            minLength="8"
            required
          />
          <input
            className="input-field"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={update}
            minLength="8"
            required
          />
        </div>

        <button
          className="btn-primary mt-6 w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register as Partner'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#755F54]">
            Already have an account?{' '}
            <a href="/login" className="font-bold text-[#7A2E1F] hover:text-[#FC8019]">
              Sign in here
            </a>
          </p>
        </div>
      </form>
    </section>
  );
}

export default PartnerRegister;
