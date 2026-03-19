const State = require("../models/State");
const { getIndiaLocations } = require("../services/indiaLocations");

const getAllStates = async (req, res) => {
    try {
        const states = await getIndiaLocations();
        res.json(states.map(({ stateId, stateName }) => ({ stateId, stateName })));
    } catch (error) {
        // Keep existing MongoDB data available if the catalogue host is unreachable.
        try {
            const states = await State.find().sort({ stateName: 1 });
            res.json(states);
        } catch (databaseError) {
            res.status(500).json({ message: databaseError.message });
        }
    }
};

module.exports = {
    getAllStates,
};
