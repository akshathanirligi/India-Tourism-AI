const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SECRET;
const signToken = (userId) => jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
const userResponse = (user) => ({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, createdAt: user.createdAt });

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "All fields are required." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    if (await User.exists({ email: email.toLowerCase().trim() })) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ firstName, lastName, email, password });
    return res.status(201).json({ token: signToken(user._id), user: userResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create your account." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: "Invalid email or password." });
    return res.json({ token: signToken(user._id), user: userResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to sign in." });
  }
};

exports.me = (req, res) => res.json({ user: userResponse(req.user) });
