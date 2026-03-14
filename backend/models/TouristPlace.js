const mongoose = require("mongoose");

const touristPlaceSchema = new mongoose.Schema(
{
    placeId: {
        type: String,
        required: true,
        unique: true
    },

    districtId: {
        type: String,
        required: true
    },

    placeName: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    bestSeason: {
        type: String
    },

    averageVisitTime: {
        type: String
    },

    latitude: {
        type: Number
    },

    longitude: {
        type: Number
    },

    location: {
        type: String
    },

    entryFee: {
        type: Number
    },

    timings: {
        type: String
    },

    rating: {
        type: Number
    },

    images: {
        type: [String],
        default: []
    }

},
{
    timestamps: true,

    // IMPORTANT
    collection: "tourist_places"
}
);

module.exports = mongoose.model("TouristPlace", touristPlaceSchema);
