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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
const services_1 = require("../services");
dotenv_1.default.config();
// Controller to get coordinates from an address
const getAddressCoordinate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate query parameters
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { address } = req.query;
    if (!address || typeof address !== "string") {
        res.status(400).json({
            error: "Address query parameter is required and must be a string",
        });
        return;
    }
    const url = process.env.OPENCAGE_URL;
    try {
        const response = yield axios_1.default.get(url, {
            params: {
                key: process.env.OPENCAGE_API_KEY,
                q: address,
                limit: 1,
                no_annotations: 1,
            },
        });
        if (response.data.results.length > 0) {
            const result = response.data.results[0];
            const { lat, lng } = result.geometry;
            const { formatted } = result;
            res.status(200).json({
                lat,
                lng,
                location: formatted,
            });
        }
        else {
            res
                .status(404)
                .json({ error: "No results found for the provided address" });
        }
    }
    catch (error) {
        console.error("Error fetching coordinates:", error);
        next(error);
    }
});
// Controller to get distance and travel time between two addresses
const getDistanceAndTime = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { origin, destination } = req.query;
    // profile: "driving" | "walking" | "cycling" = "cycling"
    if (!origin || !destination) {
        res
            .status(400)
            .json({ error: "Both origin and destination addresses are required" });
        return;
    }
    try {
        // Geocode origin and destination
        const originCoordinates = yield (0, services_1.getGeocodeCoordinatesByAddress)(origin);
        const destinationCoordinates = yield (0, services_1.getGeocodeCoordinatesByAddress)(destination);
        // profile: "driving" | "walking" | "cycling" = "cycling"
        const { distance, duration } = yield (0, services_1.getDistanceTimeOSRM)(originCoordinates, destinationCoordinates);
        // Calculate distance using the Haversine formula
        const distanced = (0, services_1.haversineDistance)(originCoordinates.lat, originCoordinates.lng, destinationCoordinates.lat, destinationCoordinates.lng);
        const formattedDurationForORSM = (0, services_1.formatDuration)(duration);
        res.status(200).json({
            distance: distanced.toFixed(2), // Distance in kilometers
            origin: originCoordinates,
            destination: destinationCoordinates,
            distanceByOSRM: distance,
            durationByOSRM: formattedDurationForORSM,
        });
    }
    catch (error) {
        console.error("Error calculating distance and time:", error);
        next(error);
    }
});
const getAddressSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate query parameters
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { address } = req.query;
    if (!address || typeof address !== "string") {
        res.status(400).json({
            error: "Address query parameter is required and must be a string",
        });
        return;
    }
    try {
        // Use Nominatim (OpenStreetMap) API to get address suggestions based on input
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=5`;
        const geocodeResponse = yield axios_1.default.get(geocodeUrl, {
            headers: {
                "Accept-Language": "en",
            },
        });
        // Check if we have results
        if (geocodeResponse.data.length > 0) {
            const suggestions = geocodeResponse.data.map((item) => ({
                label: item.display_name, // Full address display
                latitude: item.lat,
                longitude: item.lon,
            }));
            // Return suggestions
            res.status(200).json({ suggestions });
        }
        else {
            res.status(404).json({ message: "No address suggestions found" });
        }
    }
    catch (error) {
        console.error("Error fetching address suggestions:", error);
        res
            .status(500)
            .json({ message: "An error occurred while fetching suggestions" });
    }
});
exports.default = {
    getAddressCoordinate,
    getDistanceAndTime,
    getAddressSuggestions,
};
