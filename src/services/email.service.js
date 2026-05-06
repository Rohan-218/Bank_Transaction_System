require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = 'Welcome to Backend Ledger 🚀';

  const text = `Hi ${name},

    Welcome to Backend Ledger! 🎉

    We're glad to have you with us.

    With Backend Ledger, you can easily manage your financial records, track expenses, and stay in control of your workflow — all in one place.

    To get started, simply log in and explore your dashboard.

    If you have any questions or need assistance, feel free to reply to this email. We're always here to help.

    Best regards,  
    The Backend Ledger Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Welcome to Backend Ledger, ${name}! 🎉</h2>
      
      <p>We're glad to have you with us.</p>
      
      <p>
        With <strong>Backend Ledger</strong>, you can easily manage your financial records,
        track expenses, and stay in control of your workflow — all in one place.
      </p>
      
      <p>
        <a href="#" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">
          Go to Dashboard
        </a>
      </p>
      
      <p>
        If you have any questions or need assistance, just reply to this email —
        we're always here to help.
      </p>
      
      <br/>
      
      <p>Best regards,<br/><strong>The Backend Ledger Team</strong></p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Alert: Funds Transferred';

  const text = `Hi ${name},

    A transaction has been completed successfully.

    Amount: ${amount}
    To Account: ${toAccount}

    If you have any questions or need assistance, feel free to reply to this email. We're always here to help.

    Best regards,
    The Backend Ledger Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Transaction Alert: Funds Transferred</h2>
      <p>A transaction has been completed successfully.</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>To Account:</strong> ${toAccount}</p>
      <p>If you have any questions or need assistance, feel free to reply to this email. We're always here to help.</p>
      <p>Best regards,<br/>The Backend Ledger Team</p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {

  const subject = 'Transaction Failed ❌';

  const text = `Hi ${name},

  Your transaction could not be completed.

  Amount: ${amount}
  To Account: ${toAccount}

  No amount has been deducted. Please try again.

  - Backend Ledger`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h3 style="color: #E53935;">Transaction Failed ❌</h3>
      <p>Hi ${name},</p>
      <p>Your transaction could not be completed.</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>To Account:</strong> ${toAccount}</p>
      <p style="color: #2E7D32;">No amount has been deducted. Please try again.</p>
      <p>- Backend Ledger</p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};