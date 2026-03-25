const mongoose = require("mongoose");
const connectDB = require("../config/db");
const TouristPlace = require("../models/TouristPlace");
const Hotel = require("../models/Hotel");
const Restaurant = require("../models/Restaurant");
const { getTouristPlaceLocation } = require("../services/touristPlaceLocations");

const places = [
  { placeId: "KA-KOD-002", districtId: "KA-KOD", placeName: "Raja's Seat", category: "Viewpoint", description: "A garden viewpoint in Madikeri known for its valley and sunset views.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 20, timings: "5:30 AM - 8:00 PM", rating: 4.5 },
  { placeId: "KA-KOD-003", districtId: "KA-KOD", placeName: "Dubare Elephant Camp", category: "Wildlife", description: "An eco-tourism destination on the Kaveri river, known for elephant experiences.", bestSeason: "October - May", averageVisitTime: "3-4 Hours", entryFee: 100, timings: "9:00 AM - 11:00 AM", rating: 4.4 },
  { placeId: "KA-KOD-004", districtId: "KA-KOD", placeName: "Talakaveri", category: "Temple", description: "The revered origin point of the River Kaveri in the Brahmagiri hills.", bestSeason: "October - March", averageVisitTime: "2 Hours", entryFee: 0, timings: "6:00 AM - 7:00 PM", rating: 4.6 },
  { placeId: "KA-KOD-005", districtId: "KA-KOD", placeName: "Cauvery Nisargadhama", category: "Nature", description: "A riverine island near Kushalnagar with a hanging bridge and shaded walks.", bestSeason: "October - May", averageVisitTime: "2-3 Hours", entryFee: 30, timings: "9:00 AM - 5:30 PM", rating: 4.3 },
  { placeId: "KA-KOD-006", districtId: "KA-KOD", placeName: "Golden Temple, Bylakuppe", category: "Culture", description: "A Tibetan Buddhist monastery complex near Kushalnagar.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 6:00 PM", rating: 4.7 },
];

const hotels = [
  { hotelId: "HTL002", placeId: "KA-KOD-001", hotelName: "Zostel Coorg (Madikeri)", category: "Hostel dorm bed", pricePerNight: 699, rating: 4.5, amenities: ["WiFi", "Common area", "Parking"], address: "Madikeri, Kodagu" },
  { hotelId: "HTL003", placeId: "KA-KOD-001", hotelName: "The Hosteller Coorg, Madikeri", category: "Hostel dorm bed", pricePerNight: 900, rating: 4.4, amenities: ["WiFi", "Common area"], address: "Madikeri, Kodagu" },
  { hotelId: "HTL004", placeId: "KA-KOD-002", hotelName: "Madikeri Budget Homestay", category: "Budget homestay", pricePerNight: 1500, rating: 4.2, amenities: ["WiFi", "Parking"], address: "Madikeri, Kodagu" },
];

const restaurants = [
  { restaurantId: "RES002", placeId: "KA-KOD-002", restaurantName: "Madikeri Local Kitchen", cuisine: "Kodava & South Indian", averageCost: 300, rating: 4.3, specialties: ["Akki Roti", "Filter Coffee"], address: "Madikeri, Kodagu" },
  { restaurantId: "RES003", placeId: "KA-KOD-003", restaurantName: "Kushalnagar Food Stop", cuisine: "South Indian", averageCost: 250, rating: 4.2, specialties: ["Meals", "Dosa"], address: "Kushalnagar, Kodagu" },
];

async function seed() {
  await connectDB();
  for (const place of places) {
    const location = getTouristPlaceLocation({
      placeName: place.placeName,
      districtName: "Kodagu",
      stateName: "Karnataka",
    });
    await TouristPlace.updateOne({ placeId: place.placeId }, { $set: { ...place, ...location } }, { upsert: true });
  }
  for (const hotel of hotels) await Hotel.updateOne({ hotelId: hotel.hotelId }, { $set: hotel }, { upsert: true });
  for (const restaurant of restaurants) await Restaurant.updateOne({ restaurantId: restaurant.restaurantId }, { $set: restaurant }, { upsert: true });
  await mongoose.disconnect();
}

seed().catch(() => process.exit(1));
