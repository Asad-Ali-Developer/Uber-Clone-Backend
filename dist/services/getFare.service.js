"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getDistanceTimeOSRM_service_1 = __importDefault(require("./getDistanceTimeOSRM.service"));
// Fare rates for different vehicle types
const fareRates = {
    car: {
        baseFare: 100, // Base fare in your currency
        perKmRate: 10, // Per kilometer rate
        perMinuteRate: 2, // Per minute rate
    },
    bike: {
        baseFare: 50,
        perKmRate: 15,
        perMinuteRate: 3,
    },
    auto: {
        baseFare: 40,
        perKmRate: 5,
        perMinuteRate: 1,
    },
};
const fareCalculator = (origin, destination, vehicleType) => __awaiter(void 0, void 0, void 0, function* () {
    const results = {}; // Object to hold fares for all vehicle types
    // Get the distance and duration from OSRM service
    const { distance, duration } = yield (0, getDistanceTimeOSRM_service_1.default)(origin, destination, vehicleType);
    if (typeof distance !== "number" || typeof duration !== "number") {
        throw new Error("Invalid distance or duration returned from OSRM service");
    }
    // Iterate over each vehicle type to calculate fares
    for (const vehicleType in fareRates) {
        const rates = fareRates[vehicleType];
        // Calculate the fare for this vehicle type
        const totalFare = rates.baseFare +
            distance * rates.perKmRate +
            duration * rates.perMinuteRate;
        // Store the calculated fare in the results object
        results[vehicleType] = Math.round(totalFare); // Round the fare
    }
    return results; // Return an object containing fares for all vehicle types
});
exports.default = fareCalculator;
