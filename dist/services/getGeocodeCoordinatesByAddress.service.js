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
dotenv_1.default.config();
const getGeocodeCoordinatesByAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const url = process.env.OPENCAGE_URL;
    const response = yield axios_1.default.get(url, {
        params: {
            key: process.env.OPENCAGE_API_KEY,
            q: address,
            limit: 1,
        },
    });
    if (response.data.results.length === 0) {
        throw new Error("No results found for the address");
    }
    const { lat, lng } = response.data.results[0].geometry;
    const { formatted } = response.data.results[0];
    return { lat, lng, location: formatted };
});
exports.default = getGeocodeCoordinatesByAddress;
