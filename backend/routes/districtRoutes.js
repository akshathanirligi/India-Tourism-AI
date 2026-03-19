const express = require("express");
const router = express.Router();

const { getDistrictsByState } = require("../controllers/districtController");

router.get("/:stateId", getDistrictsByState);

module.exports = router;
