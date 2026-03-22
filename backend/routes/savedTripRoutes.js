const express = require("express");
const requireAuth = require("../middleware/authMiddleware");
const { getSavedTrips, saveTrip, removeSavedTrip } = require("../controllers/savedTripController");

const router = express.Router();
router.use(requireAuth);
router.get("/", getSavedTrips);
router.post("/", saveTrip);
router.delete("/:id", removeSavedTrip);
module.exports = router;
