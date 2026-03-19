const express = require("express");

const router = express.Router();

const {
    getAllRestaurants,
    getRestaurantsByPlace
} = require("../controllers/restaurantController");

// Get all restaurants
router.get("/", getAllRestaurants);

// Get restaurants by placeId
router.get("/place/:placeId", getRestaurantsByPlace);

module.exports = router;