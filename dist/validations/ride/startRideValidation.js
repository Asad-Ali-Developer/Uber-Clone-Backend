"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const startRideValidation = [
    (0, express_validator_1.body)("rideId").isMongoId().withMessage("Ride Id is required"),
    (0, express_validator_1.body)("otp")
        .isString()
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP is required"),
];
exports.default = startRideValidation;
