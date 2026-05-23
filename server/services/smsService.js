const axios = require('axios');

const sendSms = async ({ phone, message }) => {
  if (!process.env.FAST2SMS_API_KEY) {
    console.log(`SMS skipped for ${phone}: ${message}`);
    return;
  }

  await axios.post(
    'https://www.fast2sms.com/dev/bulkV2',
    {
      route: 'q',
      message,
      language: 'english',
      flash: 0,
      numbers: phone.replace(/^\+91/, '')
    },
    {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );
};

module.exports = { sendSms };
