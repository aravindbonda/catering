const axios = require('axios');  // npm install axios

/**
 * sendSMS({ to, otp })
 * `to` can be '+919876543210' or '9876543210' — we clean it either way
 */
const sendSMS = async ({ to, otp }) => {
  // Guard: if API key is missing, fail early with a clear message
  if (!process.env.FAST2SMS_API_KEY) {
    throw new Error('FAST2SMS_API_KEY is not set in .env');
  }

  // Fast2SMS needs a plain 10-digit Indian number (no country code, no spaces)
  const cleanNumber = to.replace(/^\+91/, '').replace(/\D/g, '');

  if (cleanNumber.length !== 10) {
    throw new Error(`Invalid phone number length: "${cleanNumber}" (expected 10 digits)`);
  }

  const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
    params: {
      authorization:    process.env.FAST2SMS_API_KEY,
      route:            'otp',         // Free OTP route
      variables_values: otp,           // 6-digit OTP code
      numbers:          cleanNumber,   // 10-digit Indian number
    },
    // Fast2SMS sometimes responds slowly — 10s timeout
    timeout: 10000,
  });

  const data = response.data;

  if (!data.return) {
    console.error('❌ Fast2SMS error:', data.message);
    throw new Error(data.message || 'SMS sending failed');
  }

  console.log(`📱 SMS sent to ${cleanNumber} — RequestID: ${data.request_id}`);
  return data;
};

module.exports = sendSMS;