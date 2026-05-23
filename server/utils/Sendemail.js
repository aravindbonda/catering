require('dotenv').config(); // ✅ Load .env FIRST before anything else

const nodemailer = require('nodemailer');

/* ── Detect environment ── */
const IS_LOCAL =
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  process.env.NODE_ENV === 'development';

/* ── Transporter (Gmail with App Password) ── */
let transporter = null;

if (!IS_LOCAL) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  /* ── Verify SMTP connection on startup ── */
  transporter.verify((error) => {
    if (error) {
      console.error('❌ SMTP connection failed:', error.message);
    } else {
      console.log('✅ SMTP ready — Gmail connected as:', process.env.EMAIL_USER);
    }
  });
} else {
  console.log('📭 Email running in LOCAL mode — emails will be logged, not sent.');
  console.log('   Set EMAIL_USER and EMAIL_PASS in your .env to enable real sending.\n');
}

/* ── Helper: strip HTML tags for plain text fallback ── */
const extractTextFromHTML = (html) =>
  html
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * sendEmail({ to, subject, html })
 *
 * - In LOCAL mode  → logs OTP to console, returns success
 * - In PROD mode   → sends real email via Gmail SMTP
 */
const sendEmail = async ({ to, subject, html }) => {
  /* ── LOCAL / DEV fallback ── */
  if (IS_LOCAL) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 EMAIL (LOCAL TEST MODE)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('To      :', to);
    console.log('Subject :', subject);

    const otpMatch = html.match(/\b\d{4,6}\b/);
    if (otpMatch) {
      console.log('🔑 OTP  :', otpMatch[0]);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return { success: true, message: 'Email logged (local mode)' };
  }

  /* ── PRODUCTION — send real email ── */
  try {
    const info = await transporter.sendMail({
      from: `"CaterBliss" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: extractTextFromHTML(html),
    });

    console.log(`✅ Email sent to ${to} — Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return { success: false, error: error.message };
  }
};

/* ─────────────────────────────────────────────────────────────
   Email Templates
───────────────────────────────────────────────────────────── */

/** OTP email for registration */
const registerOTPTemplate = (fullName, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Verify your CaterBliss account</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;
                      box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#b5293a;padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:1px;">
                🍽️ CaterBliss
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">
                Account Verification
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="font-size:16px;color:#333;margin:0 0 12px;">
                Hi <strong>${fullName}</strong>,
              </p>
              <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 24px;">
                Welcome to CaterBliss! Please use the verification code below
                to complete your registration. This code is valid for
                <strong>2 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 24px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#fff8f8;border:2px solid #b5293a;
                                   border-radius:10px;padding:20px 48px;
                                   text-align:center;">
                          <p style="margin:0 0 6px;font-size:11px;color:#999;
                                    letter-spacing:2px;text-transform:uppercase;">
                            Your OTP Code
                          </p>
                          <p style="margin:0;font-size:38px;font-weight:bold;
                                    letter-spacing:12px;color:#b5293a;">
                            ${otp}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#888;line-height:1.6;margin:0 0 12px;">
                For your security, do not share this code with anyone.
                CaterBliss will never ask for your OTP over call or chat.
              </p>
              <p style="font-size:13px;color:#aaa;margin:0;">
                If you did not create a CaterBliss account, you can safely
                ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:16px 32px;
                       border-top:1px solid #eeeeee;text-align:center;">
              <p style="margin:0;font-size:11px;color:#aaa;">
                This is an automated transactional email from CaterBliss.
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#aaa;">
                © ${new Date().getFullYear()} CaterBliss, Vijayawada, Andhra Pradesh, India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/** OTP email for password reset */
const resetOTPTemplate = (email, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Reset your CaterBliss password</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;
                      box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#b5293a;padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:1px;">
                🍽️ CaterBliss
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">
                Password Reset Request
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="font-size:16px;color:#333;margin:0 0 12px;">Hello,</p>
              <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 24px;">
                We received a request to reset the password for
                <strong>${email}</strong>.
                Use the code below to proceed. It expires in
                <strong>2 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 24px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#fff8f8;border:2px solid #b5293a;
                                   border-radius:10px;padding:20px 48px;
                                   text-align:center;">
                          <p style="margin:0 0 6px;font-size:11px;color:#999;
                                    letter-spacing:2px;text-transform:uppercase;">
                            Password Reset OTP
                          </p>
                          <p style="margin:0;font-size:38px;font-weight:bold;
                                    letter-spacing:12px;color:#b5293a;">
                            ${otp}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#888;line-height:1.6;margin:0;">
                This code can only be used once. If you did not request a
                password reset, please ignore this email — your account
                remains secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:16px 32px;
                       border-top:1px solid #eeeeee;text-align:center;">
              <p style="margin:0;font-size:11px;color:#aaa;">
                This is an automated transactional email from CaterBliss.
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#aaa;">
                © ${new Date().getFullYear()} CaterBliss, Vijayawada, Andhra Pradesh, India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = { sendEmail, registerOTPTemplate, resetOTPTemplate };