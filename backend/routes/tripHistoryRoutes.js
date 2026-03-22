const express = require("express");
const requireAuth = require("../middleware/authMiddleware");
const { getTripHistory, deleteTripHistory } = require("../controllers/tripHistoryController");

const router = express.Router();
router.use(requireAuth);
router.get("/", getTripHistory);
router.delete("/:id", deleteTripHistory);
module.exports = router;
