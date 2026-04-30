const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
{
    hotelId: {
        type: String,
        required: true,
        unique: true
    },

    placeId: {
        type: String,
        required: true
    },

    hotelName: {
        type: String,
        required: true
    },

    category: {
        type: String
    },

    pricePerNight: {
        type: Number
    },

    rating: {
        type: Number
    },

    amenities: {
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
    collection: "hotels"
}
);

module.exports = mongoose.model("Hotel", hotelSchema);