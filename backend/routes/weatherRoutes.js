const express = require("express");
const { getWeather } = require("../controllers/weatherController");
const router = express.Router();
router.post("/", getWeather);
module.exports = router;
