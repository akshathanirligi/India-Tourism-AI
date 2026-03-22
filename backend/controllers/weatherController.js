const TouristPlace = require("../models/TouristPlace");

const KODAGU_COORDINATES = { latitude: 12.3375, longitude: 75.8069 };

const getWeather = async (req, res) => {
  try {
    const place = await TouristPlace.findOne({ placeId: req.body.placeId }).lean();
    const latitude = place?.latitude || KODAGU_COORDINATES.latitude;
    const longitude = place?.longitude || KODAGU_COORDINATES.longitude;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather service unavailable");
    const data = await response.json();
    const rainChance = data.daily.precipitation_probability_max[0] || 0;
    const code = data.current.weather_code;
    const rainy = rainChance >= 40 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code);
    const hot = data.current.temperature_2m >= 30;
    const advice = rainy
      ? "Rain is possible today. Prefer Golden Temple, Talakaveri, cafés, and other cultural stops; keep waterfalls only if conditions are safe."
      : hot
        ? "It may be warm. Start outdoor places early, keep an afternoon break, and visit Raja's Seat near sunset."
        : "Good conditions for outdoor sightseeing. Abbey Falls, Dubare, and Nisargadhama are great daytime choices.";
    res.json({ available: true, temperature: data.current.temperature_2m, windSpeed: data.current.wind_speed_10m, rainChance, weatherCode: code, advice });
  } catch (error) {
    res.json({ available: false, advice: "Live weather is temporarily unavailable. Check local conditions before outdoor activities." });
  }
};

module.exports = { getWeather };
