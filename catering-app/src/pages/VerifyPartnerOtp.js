import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function VerifyPartnerOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { identifier } = location.state || {};

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/auth/verify-partner-otp', { identifier, otp });
      navigate('/login', {
        state: {
          message: 'Partner registration successful! Your account is pending admin approval. You will be notified once approved.'
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post('/api/auth/resend-otp', { identifier, purpose: 'register' });
      alert('Email OTP sent successfully');
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <section className="grid min-h-[80vh] place-items-center px-4 py-12">
      <form className="panel-card w-full max-w-md" onSubmit={submit}>
        <div className="text-center">
          <p className="eyebrow">Partner Verification</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#282C3F]">Verify Your Email</h1>
          <p className="mt-2 text-sm text-[#686B78]">
            We've sent a 6-digit OTP to <strong>{identifier}</strong>
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-bold text-[#282C3F]">
            Enter OTP
          </label>
          <input
            className="input-field text-center text-2xl tracking-widest"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength="6"
            required
          />
          <p className="mt-2 text-xs text-[#686B78]">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <button
          className="btn-primary mt-6 w-full"
          type="submit"
          disabled={loading || otp.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#686B78]">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={resendOtp}
              className="font-bold text-saffron-700 hover:text-saffron-600"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </form>
    </section>
  );
}

export default VerifyPartnerOtp;
