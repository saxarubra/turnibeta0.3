import nodemailer from 'nodemailer';

export interface GmailEmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendGmailEmail(data: GmailEmailData) {
  console.log('Chiamata a sendGmailEmail con:', data);
  // Configura il trasportatore SMTP di Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'saxarubra915@gmail.com',
      pass: 'fkbaaikzxoxdftoh', // La tua password per le app
    },
  });

  // Invia l'email
  const info = await transporter.sendMail({
    from: 'Turni <saxarubra915@gmail.com>',
    to: data.to,
    subject: data.subject,
    html: data.html,
  });

  console.log('Email inviata:', info.messageId);
  return info;
} 