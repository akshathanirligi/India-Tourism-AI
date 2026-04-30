const mongoose = require("mongoose");

const tripHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  destination: { type: String, required: true },
  stateName: { type: String, default: "" },
  districtId: { type: String, required: true },
  placeId: { type: String, required: true },
  budget: { type: Number, required: true, min: 0 },
  days: { type: Number, required: true, min: 1 },
  interests: { type: [String], default: [] },
  estimatedBudget: { type: Number, default: 0 },
}, { timestamps: true });

tripHistorySchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model("TripHistory", tripHistorySchema);
