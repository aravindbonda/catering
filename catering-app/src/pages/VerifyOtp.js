import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [identifier, setIdentifier] = useState(location.state?.identifier || '');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/api/auth/verify-otp', { identifier, otp });
      saveSession(data);
      navigate('/book', { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const resend = async () => {
    await api.post('/api/auth/resend-otp', { identifier, purpose: 'register' });
    setMessage('Email OTP sent again');
  };

  return (
    <section className="grid min-h-[75vh] place-items-center px-4 py-12">
      <form className="panel-card w-full max-w-md" onSubmit={submit}>
        <p className="eyebrow">Email Verification</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#1F1F1F]">Verify your email</h1>
        {message && <div className="mt-4 rounded-xl bg-[#FFF7EF] p-3 text-sm font-semibold text-[#7A2E1F]">{message}</div>}
        <div className="mt-5 grid gap-3">
          <input className="input-field" type="email" placeholder="Email address" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          <input className="input-field" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required />
          <button className="btn-primary w-full" type="submit">Verify Account</button>
          <button className="btn-secondary w-full" type="button" onClick={resend}>Resend Email OTP</button>
        </div>
      </form>
    </section>
  );
}

export default VerifyOtp;
