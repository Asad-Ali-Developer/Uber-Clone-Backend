"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Default Fare rates for different vehicle types (within the city)
const fareRates = {
    car: {
        baseFare: 150,
        perKmRate: 45,
        perMinuteRate: 20,
    },
    bike: {
        baseFare: 10,
        perKmRate: 5.5,
        perMinuteRate: 2,
    },
    auto: {
        baseFare: 15,
        perKmRate: 5,
        perMinuteRate: 3,
    },
};
// Adjusted rates for city-to-city travel
const cityToCityFareRates = {
    car: {
        baseFare: 150, // Higher base fare for city-to-city
        perKmRate: 30, // Higher per km rate for city-to-city
        perMinuteRate: 20, // Higher per minute rate for city-to-city
    },
    bike: {
        baseFare: 50, // Higher base fare for city-to-city bike ride
        perKmRate: 10, // Higher per km rate for city-to-city bike ride
        perMinuteRate: 5, // Higher per minute rate for city-to-city bike ride
    },
    auto: {
        baseFare: 50, // Higher base fare for city-to-city auto ride
        perKmRate: 15, // Higher per km rate for city-to-city auto ride
        perMinuteRate: 10, // Higher per minute rate for city-to-city auto ride
    },
};
// Distance threshold to determine if the trip is city-to-city
const CITY_TO_CITY_DISTANCE_THRESHOLD = 50; // km
const fareCalculator = (distance, // Distance in kilometers
duration, // Duration in minutes
vehicleType // Optional vehicle type (e.g., "car", "bike", "auto")
) => {
    // Validate inputs
    if (typeof distance !== "number" || distance <= 0) {
        throw new Error("Invalid distance value provided");
    }
    if (typeof duration !== "number" || duration < 0) {
        throw new Error("Invalid duration value provided");
    }
    // Determine if the travel is city-to-city based on the distance
    const isCityToCity = distance > CITY_TO_CITY_DISTANCE_THRESHOLD;
    // Choose the correct fare rates based on the trip type
    const ratesToUse = isCityToCity ? cityToCityFareRates : fareRates;
    // Calculate fare for a specific vehicle type
    if (vehicleType) {
        if (!ratesToUse.hasOwnProperty(vehicleType)) {
            throw new Error(`Invalid vehicle type: ${vehicleType}`);
        }
        const rates = ratesToUse[vehicleType];
        const totalFare = rates.baseFare +
            distance * rates.perKmRate +
            duration * rates.perMinuteRate;
        return Math.round(totalFare); // Round to nearest integer
    }
    // Calculate fares for all vehicle types
    const fares = {};
    for (const type in ratesToUse) {
        const rates = ratesToUse[type];
        fares[type] =
            Math.round(rates.baseFare +
                distance * rates.perKmRate +
                duration * rates.perMinuteRate);
    }
    return fares; // Return an object with fares for all vehicle types
};
exports.default = fareCalculator;
