const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SECRET;

module.exports = async function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
  if (!token) return next();
  try {
    const { userId } = jwt.verify(token, jwtSecret);
    req.user = await User.findById(userId);
  } catch {
    // A trip plan remains available to guests and expired sessions alike.
  }
  return next();
};
