import { useState } from 'react';
import api from '../services/api';

function ForgotPassword() {
  const [step, setStep] = useState('request');
  const [form, setForm] = useState({ identifier: '', otp: '', password: '' });
  const [message, setMessage] = useState('');

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const requestOtp = async (event) => {
    event.preventDefault();
    await api.post('/api/auth/forgot-password', { identifier: form.identifier });
    setMessage('Reset OTP sent to your email');
    setStep('reset');
  };

  const reset = async (event) => {
    event.preventDefault();
    await api.post('/api/auth/reset-password', form);
    setMessage('Password updated. You can login now.');
  };

  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={step === 'request' ? requestOtp : reset}>
        <h1>Reset password</h1>
        {message && <div className="alert neutral">{message}</div>}
        <input name="identifier" type="email" placeholder="Email address" value={form.identifier} onChange={update} required />
        {step === 'request' ? (
          <p className="text-sm text-[#755F54]">We will send a one-time code to your registered email.</p>
        ) : (
          <>
            <input name="otp" placeholder="OTP" value={form.otp} onChange={update} required />
            <input name="password" type="password" placeholder="New password" value={form.password} onChange={update} minLength="8" required />
          </>
        )}
        <button className="btn" type="submit">{step === 'request' ? 'Send OTP' : 'Update Password'}</button>
      </form>
    </section>
  );
}

export default ForgotPassword;
