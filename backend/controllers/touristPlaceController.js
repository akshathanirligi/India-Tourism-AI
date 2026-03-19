const TouristPlace = require("../models/TouristPlace");

// GET tourist places by districtId
const getTouristPlacesByDistrict = async (req, res) => {
    try {
        const { districtId } = req.params;

        const touristPlaces = await TouristPlace.find({ districtId });

        res.json(touristPlaces);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getTouristPlacesByDistrict,
};