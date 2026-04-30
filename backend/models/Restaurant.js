const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
{
    restaurantId: {
        type: String,
        required: true,
        unique: true
    },

    placeId: {
        type: String,
        required: true
    },

    restaurantName: {
        type: String,
        required: true
    },

    cuisine: {
        type: String
    },

    averageCost: {
        type: Number
    },

    rating: {
        type: Number
    },

    specialties: {
        type: [String],
        default: []
    },

    address: {
        type: String
    },

    contactNumber: {
        type: String
    },

    images: {
        type: [String],
        default: []
    }
},
{
    timestamps: true,
    collection: "restaurants"
}
);

module.exports = mongoose.model("Restaurant", restaurantSchema);