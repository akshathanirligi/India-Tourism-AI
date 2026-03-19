const express = require("express");
const router = express.Router();

const {
    getTouristPlacesByDistrict,
} = require("../controllers/touristPlaceController");

router.get("/:districtId", getTouristPlacesByDistrict);

module.exports = router;
