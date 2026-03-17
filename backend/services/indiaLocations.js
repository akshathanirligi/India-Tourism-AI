const { states } = require("../data/india-states-districts.json");

const districtIdOverrides = {
    KA: {
        "Kodagu": "KA-KOD",
        "Vijayanagara": "KA-35",
        "Vijayapura (Bijapur)": "KA-36",
        "Yadgir": "KA-37",
    },
};

const getDistrictId = (stateId, districtName, index) => {
    if (districtIdOverrides[stateId]?.[districtName]) {
        return districtIdOverrides[stateId][districtName];
    }

    return `${stateId}-${String(index + 1).padStart(2, "0")}`;
};

const getIndiaLocations = async () => {
    return states
        .map(({ sid, state, districts }) => ({
            stateId: state === "Himachal Pradesh" ? "HP" : sid,
            stateName: state,
            districts: districts.map((districtName, index) => ({
                districtName,
                districtId: getDistrictId(state === "Himachal Pradesh" ? "HP" : sid, districtName, index),
            })),
        }))
        .sort((a, b) => a.stateName.localeCompare(b.stateName));
};

module.exports = { getIndiaLocations };
