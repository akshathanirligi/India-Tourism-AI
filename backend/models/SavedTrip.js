const mongoose = require("mongoose");

const savedTripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  userId: { type: String, required: true, index: true },
  placeId: { type: String, required: true },
  placeName: { type: String, required: true },
  districtId: { type: String, required: true },
  districtName: { type: String, default: "" },
  stateName: { type: String, default: "" },
  state: { type: String, default: "" },
  district: { type: String, default: "" },
  touristPlace: { type: String, default: "" },
  category: { type: String, default: "" },
  rating: { type: Number },
  imageUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  days: { type: Number, default: 1 },
  budget: { type: Number, default: 0 },
  // These are snapshots so that opening a saved trip never needs to regenerate it.
  weather: { type: mongoose.Schema.Types.Mixed, default: null },
  itinerary: { type: mongoose.Schema.Types.Mixed, default: null },
  weatherSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
  tripData: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

savedTripSchema.index({ user: 1, placeId: 1 }, { unique: true });
module.exports = mongoose.model("SavedTrip", savedTripSchema);
