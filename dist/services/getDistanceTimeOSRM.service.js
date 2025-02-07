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
const getDistanceTimeOSRM = (origin, destination) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false&steps=false`;
    // profile: "driving" | "walking" | "cycling" = "cycling"
    const response = yield axios_1.default.get(url);
    if (response.data.routes.length === 0) {
        throw new Error("No routes found between the given locations");
    }
    const { distance, duration } = response.data.routes[0];
    const distanceInKM = distance / 1000;
    const duraitonInMinutes = duration / 60;
    return {
        distance: Math.round(distanceInKM),
        duration: duraitonInMinutes,
    };
});
exports.default = getDistanceTimeOSRM;
