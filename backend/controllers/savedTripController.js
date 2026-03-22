const SavedTrip = require("../models/SavedTrip");

exports.getSavedTrips = async (req, res) => {
  try { return res.json(await SavedTrip.find({ user: req.user._id }).sort({ createdAt: -1 })); }
  catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.saveTrip = async (req, res) => {
  try {
    const { placeId, placeName, districtId, districtName, stateName, category, rating, imageUrl, description, days, budget, weatherSnapshot, tripData } = req.body;
    if (!placeId || !placeName || !districtId) return res.status(400).json({ message: "Destination details are incomplete." });
    const userId = req.user._id.toString();
    const weather = weatherSnapshot || null;
    const itinerary = tripData && typeof tripData === "object" ? tripData : null;
    const tripFields = {
      user: req.user._id, userId, placeId, placeName, districtId,
      districtName, stateName, state: stateName || "", district: districtName || "", touristPlace: placeName,
      category, rating, imageUrl,
      description, days: Math.max(Number(days) || 1, 1), budget: Math.max(Number(budget) || 0, 0),
      weather, itinerary, weatherSnapshot: weather, tripData: itinerary,
    };
    // Upgrade legacy destination-only saves with the full generated trip snapshot.
    const savedTrip = await SavedTrip.findOneAndUpdate(
      { user: req.user._id, placeId },
      { $set: tripFields },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    return res.status(201).json(savedTrip);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "This destination is already saved." });
    return res.status(500).json({ message: error.message });
  }
};

exports.removeSavedTrip = async (req, res) => {
  try {
    const deleted = await SavedTrip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Saved destination was not found." });
    return res.json({ message: "Destination removed from saved trips." });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};
