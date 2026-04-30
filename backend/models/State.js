const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema(
    {
        stateId: {
            type: String,
            required: true,
            unique: true,
        },

        stateName: {
            type: String,
            required: true,
        },

        capital: {
            type: String,
            required: true,
        },

        officialLanguages: {
            type: [String],
            default: [],
        },

        tourismCategories: {
            type: [String],
            default: [],
        },

        bestSeason: {
            type: String,
        },

        description: {
            type: String,
        },

        heroImage: {
            type: String,
        },

        districtCount: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("State", stateSchema);