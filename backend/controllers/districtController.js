const District = require("../models/District");
const { getIndiaLocations } = require("../services/indiaLocations");

// GET districts by stateId
const getDistrictsByState = async (req, res) => {
    try {
        const { stateId } = req.params;

        const [states, storedDistricts] = await Promise.all([
            getIndiaLocations(),
            District.find({ stateId }).lean(),
        ]);
        const state = states.find((item) => item.stateId === stateId);

        if (!state) {
            return res.status(404).json({ message: "State not found" });
        }

        res.json(
            state.districts.map(({ districtName, districtId }) => {
                const storedDistrict = storedDistricts.find(
                    (district) => district.districtName.toLowerCase() === districtName.toLowerCase()
                );

                return {
                    districtId: storedDistrict?.districtId || districtId,
                    districtName,
                };
            })
        );
    } catch (error) {
        // Keep existing MongoDB data available if the catalogue host is unreachable.
        try {
            const districts = await District.find({ stateId }).sort({ districtName: 1 });
            res.json(districts);
        } catch (databaseError) {
            res.status(500).json({ message: databaseError.message });
        }
    }
};

module.exports = {
    getDistrictsByState,
};
