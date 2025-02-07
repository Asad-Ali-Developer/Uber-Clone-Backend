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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
/**
 * Finds captains within a specified radius of a given location.
 * @param lng - Longitude of the center point.
 * @param lat - Latitude of the center point.
 * @param radius - Radius in kilometers.
 * @returns A list of captains within the specified radius.
 */
const getCaptainsInTheRadius = (lng, lat, radius // Radius in kilometers
) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert radius from kilometers to radians (Earth's radius in kilometers is 6378.1 km)
        const radiusInRadians = radius / 6378.1;
        const captains = yield models_1.captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radiusInRadians],
                },
            },
        });
        return captains;
    }
    catch (error) {
        console.error("Error fetching captains within the radius:", error);
        throw error; // Re-throw the error to handle it in the calling function
    }
});
exports.default = getCaptainsInTheRadius;
