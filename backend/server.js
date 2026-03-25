require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { validateEnvironment } = require("./config/env");

// Resolve development defaults or validate the strict production configuration
// before authentication modules read the JWT secret.
validateEnvironment();

const stateRoutes = require("./routes/stateRoutes");
const districtRoutes = require("./routes/districtRoutes");
const touristPlaceRoutes = require("./routes/touristPlaceRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const tripRoutes = require("./routes/tripRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const nearbyRoutes = require("./routes/nearbyRoutes");
const authRoutes = require("./routes/authRoutes");
const savedTripRoutes = require("./routes/savedTripRoutes");
const tripHistoryRoutes = require("./routes/tripHistoryRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const defaultAllowedOrigins = [
  "https://india-tourism-ai.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5177",
  "http://127.0.0.1:5177",
];
const configuredAllowedOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map((origin) => origin.trim()).filter(Boolean);
const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredAllowedOrigins]);

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  maxAge: 86400,
}));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/states", stateRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/tourist-places", touristPlaceRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/nearby", nearbyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved-trips", savedTripRoutes);
app.use("/api/trip-history", tripHistoryRoutes);
app.use((error, req, res, next) => {
  if (error.message === "Origin is not allowed by CORS.") return res.status(403).json({ message: "Request origin is not allowed." });
  if (res.headersSent) return next(error);
  return res.status(500).json({ message: "An unexpected server error occurred." });
});
app.use((req, res) => res.status(404).json({ message: "Route not found." }));

connectDB()
  .then(() => app.listen(PORT))
  .catch((error) => {
    process.stderr.write(`Database connection failed: ${error.message}\n`);
    process.exit(1);
  });
