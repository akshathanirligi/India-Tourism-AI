const express = require("express");
const optionalAuth = require("../middleware/optionalAuthMiddleware");

const router = express.Router();

const {
    getTripPlan
} = require("../controllers/tripController");

router.post("/", optionalAuth, getTripPlan);

module.exports = router;
