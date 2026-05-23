const nodemailer = require('nodemailer');

const getTransport = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transport = getTransport();

  if (!transport) {
    console.log(`Email skipped for ${to}: ${text}`);
    return;
  }

  await transport.sendMail({
    from: process.env.EMAIL_FROM || `CaterBliss <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });
};

module.exports = { sendEmail };
