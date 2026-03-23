const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendOTP = async (email, otp) => {
  const mailOptions = {
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = { sendOTP };
