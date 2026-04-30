const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
{
    districtId: {
        type: String,
        required: true,
        unique: true
    },

    stateId: {
        type: String,
        required: true
    },

    districtName: {
        type: String,
        required: true
    },

    headquarters: {
        type: String
    },

    famousFor: {
        type: [String],
        default: []
    },

    bestSeason: {
        type: String
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("District", districtSchema);