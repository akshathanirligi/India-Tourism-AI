const Restaurant = require("../models/Restaurant");

// GET all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET restaurants by placeId
const getRestaurantsByPlace = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({
            placeId: req.params.placeId
        });

        res.json(restaurants);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantsByPlace
};