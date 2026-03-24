const { Resend } = require("resend");
require("dotenv").config();
const resend = new Resend(process.env.RESEND_API_KEY);
const sendOTP = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: "AI_TASK_MANAGER@resend.dev",
    to: "itsmekishorc@gmail.com",
    subject: "Password Reset OTP",
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    text: `Your OTP is: ${otp}`,
  });
  if (error) throw error;
  return data;
};
module.exports = { sendOTP };
