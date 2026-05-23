const { sendEmail } = require('./emailService');
const { sendSms } = require('./smsService');

const notifyUser = async (user, subject, message) => {
  await Promise.allSettled([
    sendEmail({ to: user.email, subject, text: message, html: `<p>${message}</p>` }),
    sendSms({ phone: user.phone, message })
  ]);
};

module.exports = { notifyUser };
