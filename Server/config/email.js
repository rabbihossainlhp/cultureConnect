const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

const sendOtpMail = async (receipientEmail, otp) => {
  try {
    const mailTemplate = `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1 style="color:#ff6b35; font-size:32px; letter-spacing:5px;">${otp}</h1>
      <p>This code expires in <strong>10 minutes</strong></p>
      <p>If you didn't request this please ignore it.</p>
    `;

    const response = await fetch(BREVO_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_FROM_EMAIL,
          name: process.env.BREVO_FROM_NAME || 'CultureConnect',
        },
        to: [{ email: receipientEmail }],
        subject: 'CultureConnect - Email Verification Code',
        htmlContent: mailTemplate,
        textContent: `Your verification code is ${otp}. It expires in 10 minutes.`,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Brevo API error:', response.status, data);
      return false;
    }

    console.log('OTP sent successfully via Brevo:', data);
    return true;
  } catch (err) {
    console.error('OTP sending error (Brevo):', err);
    return false;
  }
};

module.exports = { sendOtpMail };