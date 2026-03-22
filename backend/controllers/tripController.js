const TouristPlace = require("../models/TouristPlace");
const Hotel = require("../models/Hotel");
const Restaurant = require("../models/Restaurant");
const TripHistory = require("../models/TripHistory");

const getTripPlan = async (req, res) => {
    try {

        const {
            districtId,
            placeId,
            budget,
            days,
            interests
        } = req.body;

        let touristPlaces = await TouristPlace.find({
            districtId
        });

        // Filter by interests
        if (interests && interests.length > 0) {

            touristPlaces = touristPlaces.filter(place =>
                interests.some(interest =>
                    place.category.toLowerCase() === interest.toLowerCase()
                )
            );

        }

        const placeIds = touristPlaces.map(place => place.placeId);

        const hotels = await Hotel.find({
            placeId: { $in: placeIds }
        });

        const restaurants = await Restaurant.find({
            placeId: { $in: placeIds }
        });

        const tripDays = Math.max(Number(days) || 1, 1);
        const userBudget = Math.max(Number(budget) || 0, 0);
        const selectedPlace = touristPlaces.find((place) => place.placeId === placeId) || touristPlaces[0];
        const cheapestHotel = [...hotels].sort((a, b) => a.pricePerNight - b.pricePerNight)[0];
        const cheapestMeal = Math.min(...restaurants.map((restaurant) => restaurant.averageCost || 600), 600);
        const hotelNights = Math.max(tripDays - 1, 0);
        const entryFee = selectedPlace?.entryFee || 0;
        // averageCost is treated as a practical per-day food allowance,
        // so a budget plan is not inflated by restaurant menu prices.
        const foodCost = cheapestMeal * tripDays;
        const stayCost = (cheapestHotel?.pricePerNight || 0) * hotelNights;
        const estimatedBudget = entryFee + foodCost + stayCost;
        const shortfall = Math.max(estimatedBudget - userBudget, 0);

        // Every authenticated trip generation is part of the user's history.
        // Guests can still generate plans through the optional-auth route.
        if (req.user && selectedPlace) {
            await TripHistory.create({
                user: req.user._id,
                destination: selectedPlace.placeName,
                stateName: req.body.stateName || "",
                districtId,
                placeId: selectedPlace.placeId,
                budget: userBudget,
                days: tripDays,
                interests: Array.isArray(interests) ? interests : [],
                estimatedBudget,
            });
        }

        res.json({

            districtId,
            budget,
            days,
            interests,

            touristPlaces,

            hotels,

            restaurants,

            estimatedBudget,

            budgetSummary: {
                userBudget,
                entryFee,
                foodCost,
                stayCost,
                withinBudget: estimatedBudget <= userBudget,
                remaining: Math.max(userBudget - estimatedBudget, 0),
                shortfall,
                message: estimatedBudget <= userBudget
                    ? `Your plan is within budget. You can save ₹${userBudget - estimatedBudget}.`
                    : `The cheapest available plan needs ₹${shortfall} more than your budget.`,
            },

            recommendedSeason:
                touristPlaces[0]?.bestSeason || "Any Time"

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getTripPlan
};
