const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Check Authorization header first (sent by frontend axios interceptor),
  // fall back to cookie for browser cookie-based auth.
  let token = req.cookies?.token;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }

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
