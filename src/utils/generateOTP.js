const crypto = require("crypto");
const generateOTP = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += chars[crypto.randomInt(chars.length)];
  }
  return otp;
};
module.exports = { generateOTP };
