const { sendEmail } = require('./emailService');

const notifyUser = async (user, subject, message) => {
  await Promise.allSettled([
    sendEmail({ to: user.email, subject, text: message, html: `<p>${message}</p>` })
  ]);
};

module.exports = { notifyUser };
