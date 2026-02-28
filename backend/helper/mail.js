// helper/mailer.js
const nodemailer = require('nodemailer');

const sendOTPEmail = async (toEmail, otp) => {
  // Use App Password if you're using Gmail (not your real password)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,        // your Gmail address
      pass: process.env.APP_PASSWORD // your Gmail App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: 'Your OTP for Resume Builder Verification',
    html: `<h2>Your OTP is: <span style="color:blue;">${otp}</span></h2>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
