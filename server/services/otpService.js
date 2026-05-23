const { generateOtp, otpExpiry } = require('../utils/generateOtp');
const { sendEmail } = require('./emailService');
const { sendSms } = require('./smsService');

const createOtp = async (user, purpose, channel = 'email') => {
  const code = generateOtp();
  user.otp = { code, expiresAt: otpExpiry(), purpose, channel };
  await user.save();

  const message = `Your CaterBliss ${purpose} OTP is ${code}. It expires in 10 minutes.`;

  if (channel === 'phone') {
    await sendSms({ phone: user.phone, message });
  } else {
    await sendEmail({
      to: user.email,
      subject: 'CaterBliss OTP Verification',
      text: message,
      html: `<p>${message}</p>`
    });
  }
};

const verifyOtp = (user, code, purpose) => {
  if (!user.otp || !user.otp.code || !user.otp.expiresAt) return false;
  if (user.otp.purpose !== purpose) return false;
  if (user.otp.code !== String(code)) return false;
  return user.otp.expiresAt.getTime() > Date.now();
};

module.exports = { createOtp, verifyOtp };
