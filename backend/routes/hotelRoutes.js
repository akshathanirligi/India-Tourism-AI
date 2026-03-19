const express = require("express");

const router = express.Router();

const {
    getAllHotels,
    getHotelsByPlace
} = require("../controllers/hotelController");

// Get all hotels
router.get("/", getAllHotels);

// Get hotels by placeId
router.get("/place/:placeId", getHotelsByPlace);

module.exports = router;