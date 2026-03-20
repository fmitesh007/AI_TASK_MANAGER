const { GoogleGenerativeAI } = require("@google/generative-ai");
const model = () => {
  const genAi = new GoogleGenerativeAI(process.env.GEMINI);
  return genAi.getGenerativeModel({ model: "gemini-2.5-flash" });
};
module.exports = model;
