"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const map_controller_1 = __importDefault(require("../controllers/map.controller"));
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
const { getAddressCoordinate, getDistanceAndTime, getAddressSuggestions } = map_controller_1.default;
// Route to fetch coordinates
router.get("/get-coordinates", validations_1.mapQueryValidaiton, middlewares_1.authUserMiddleware, getAddressCoordinate);
router.get("/get-distance-time", validations_1.mapDistanceTimeValidation, middlewares_1.authUserMiddleware, getDistanceAndTime);
router.get("/get-address-suggestions", validations_1.mapAddressingSuggestionsValidation, middlewares_1.authUserMiddleware, getAddressSuggestions);
exports.default = router;
