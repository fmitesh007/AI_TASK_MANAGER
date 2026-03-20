const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ message: "Login please" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTSECERET);
    req.user = decoded.id;
    next();
  } catch (err) {
    return res.json(err);
  }
};
