const Hotel = require("../models/Hotel");

// GET all hotels
const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET hotels by placeId
const getHotelsByPlace = async (req, res) => {
    try {
        const hotels = await Hotel.find({
            placeId: req.params.placeId
        });

        res.json(hotels);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllHotels,
    getHotelsByPlace
};