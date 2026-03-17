const stateCentres = {
  "Andaman and Nicobar Island (UT)": [11.7401, 92.6586],
  "Andhra Pradesh": [15.9129, 79.74],
  "Arunachal Pradesh": [28.218, 94.7278],
  Assam: [26.2006, 92.9376],
  Bihar: [25.0961, 85.3131],
  "Chandigarh (UT)": [30.7333, 76.7794],
  Chhattisgarh: [21.2787, 81.8661],
  "Dadra and Nagar Haveli (UT)": [20.1809, 73.0169],
  "Daman and Diu (UT)": [20.4283, 72.8397],
  "Delhi (NCT)": [28.6139, 77.209],
  Goa: [15.2993, 74.124],
  Gujarat: [22.2587, 71.1924],
  Haryana: [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1734],
  "Jammu and Kashmir": [33.7782, 76.5762],
  Jharkhand: [23.6102, 85.2799],
  Karnataka: [15.3173, 75.7139],
  "Ladakh(UT)": [34.1526, 77.5771],
  "Lakshadweep (UT)": [10.5667, 72.6417],
  Kerala: [10.8505, 76.2711],
  "Madhya Pradesh": [22.9734, 78.6569],
  Maharashtra: [19.7515, 75.7139],
  Manipur: [24.6637, 93.9063],
  Meghalaya: [25.467, 91.3662],
  Mizoram: [23.1645, 92.9376],
  Nagaland: [26.1584, 94.5624],
  Odisha: [20.9517, 85.0985],
  "Puducherry (UT)": [11.9416, 79.8083],
  Punjab: [31.1471, 75.3412],
  Rajasthan: [27.0238, 74.2179],
  Sikkim: [27.533, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  Telangana: [18.1124, 79.0193],
  Tripura: [23.9408, 91.9882],
  Uttarakhand: [30.0668, 79.0193],
  "Uttar Pradesh": [26.8467, 80.9462],
  "West Bengal": [22.9868, 87.855],
};

// Exact coordinates for the attractions that are explicitly curated in the seed data.
const knownPlaceCoordinates = {
  "Cubbon Park": [12.9763, 77.5929], "Lalbagh Botanical Garden": [12.9507, 77.5848], "Vidhana Soudha": [12.9795, 77.5906],
  "Mysore Palace": [12.3052, 76.6552], "Chamundi Hills": [12.2729, 76.6716], "Brindavan Gardens": [12.4237, 76.6552],
  "Abbey Falls": [12.3375, 75.8069], "Madikeri Fort": [12.4244, 75.7398], "Iruppu Falls": [11.9674, 75.9676], "Irupu Falls": [11.9674, 75.9676], "Raja's Seat": [12.4226, 75.7416], "Talacauvery": [12.384, 75.4897], "Talakaveri": [12.384, 75.4897], "Pushpagiri Wildlife Sanctuary": [12.661, 75.676], "Mandalpatti Viewpoint": [12.4526, 75.7559],
  "St. Mary's Islands": [13.3818, 74.6817], "Kudroli Gokarnath Temple": [12.8747, 74.8404], "Malpe Beach": [13.352, 74.703], "Krishna Temple": [13.3409, 74.7519],
  "Badami Caves": [15.915, 75.676], "Badami Fort": [15.9175, 75.687], "Agastya Lake": [15.9146, 75.6815], "Pattadakal": [15.948, 75.816], "Aihole": [15.9908, 75.877],
  "Gol Gumbaz": [16.8302, 75.735], "Ibrahim Rouza": [16.823, 75.7168], "Jami Masjid": [16.8307, 75.711], "Bijapur Fort": [16.83, 75.72], "Almatti Dam": [16.333, 75.887],
  Hampi: [15.335, 76.46], "Vijaya Vittala Temple": [15.3359, 76.462], "Stone Chariot": [15.3354, 76.462], "Virupaksha Temple": [15.3357, 76.4623], "Lotus Mahal": [15.3207, 76.465], "Elephant Stables": [15.3201, 76.4658],
  "Marina Beach": [13.0499, 80.2824], "Kapaleeshwarar Temple": [13.0339, 80.2696], "Meenakshi Amman Temple": [9.9195, 78.1193], "Ooty Lake": [11.4064, 76.6932], "Dodabetta Peak": [11.4038, 76.735],
  "Gateway of India": [18.922, 72.8347], "Marine Drive": [18.943, 72.8238], "Shaniwar Wada": [18.5195, 73.8553], "Sinhagad Fort": [18.3663, 73.7556],
  "Amber Fort": [26.9855, 75.8513], "Hawa Mahal": [26.9239, 75.8267], "Taj Mahal": [27.1751, 78.0421], "Agra Fort": [27.1795, 78.0211],
  "Kashi Vishwanath Temple": [25.3109, 83.0107], "Dashashwamedh Ghat": [25.3063, 83.0103], "Baga Beach": [15.5553, 73.7517], "Fort Aguada": [15.492, 73.773], "Palolem Beach": [15.0099, 74.0232],
  "Naini Lake": [29.3919, 79.4542], "Har Ki Pauri": [29.9583, 78.159], "The Ridge": [31.1048, 77.1734], "Solang Valley": [32.315, 77.157], "Dal Lake": [34.0846, 74.7973], "Gulmarg Gondola": [34.052, 74.385],
};

const stableOffset = (value, seed) => {
  let hash = seed;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return ((hash % 1601) - 800) / 10000;
};

function getTouristPlaceLocation({ placeName, districtName, stateName }) {
  const exact = knownPlaceCoordinates[placeName];
  const [baseLatitude, baseLongitude] = stateCentres[stateName] || [22.5937, 78.9629];

  return {
    latitude: exact?.[0] ?? Number((baseLatitude + stableOffset(`${districtName}-${placeName}`, 17)).toFixed(6)),
    longitude: exact?.[1] ?? Number((baseLongitude + stableOffset(`${placeName}-${districtName}`, 53)).toFixed(6)),
    location: `${districtName}, ${stateName}, India`,
  };
}

module.exports = { getTouristPlaceLocation };
