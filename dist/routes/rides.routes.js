"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ride_controller_1 = __importDefault(require("../controllers/ride.controller"));
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const router = express_1.default.Router();
const { createRide, getFare, confirmRideByCaptain, startRide, completeRide } = ride_controller_1.default;
router.post("/create", validations_1.createRideValidation, middlewares_1.authUserMiddleware, createRide);
router.get("/get-fare", middlewares_1.authUserMiddleware, getFare);
router.post("/confirm-ride-by-captain", validations_1.confirmRideByCaptainValidation, middlewares_1.authCaptainMiddleware, confirmRideByCaptain);
router.post("/start-ride", validations_1.startRideValidation, middlewares_1.authCaptainMiddleware, startRide);
router.post("/complete-ride", validations_1.completeRideByCaptain, middlewares_1.authCaptainMiddleware, completeRide);
exports.default = router;
