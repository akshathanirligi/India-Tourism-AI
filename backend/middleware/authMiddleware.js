const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SECRET;

module.exports = async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication is required." });
  try {
    const { userId } = jwt.verify(token, jwtSecret);
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Your account is no longer available." });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
};
