const TripHistory = require("../models/TripHistory");

exports.getTripHistory = async (req, res) => {
  try {
    const { state, search } = req.query;
    const filter = { user: req.user._id };
    if (state) filter.stateName = state;
    if (search) filter.destination = { $regex: search, $options: "i" };
    return res.json(await TripHistory.find(filter).sort({ createdAt: -1 }));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteTripHistory = async (req, res) => {
  try {
    const trip = await TripHistory.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ message: "Trip history item was not found." });
    return res.json({ message: "Trip removed from history." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
