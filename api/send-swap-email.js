const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Usa le variabili d'ambiente di Vercel
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    res.status(500).json({ error: 'Missing Gmail credentials in environment variables' });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Turni" <${user}>`,
      to,
      subject,
      html,
    });
    res.status(200).json({ message: 'Email inviata!', messageId: info.messageId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 