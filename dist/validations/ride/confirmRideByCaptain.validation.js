"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const confirmRideByCaptainValidation = [
    (0, express_validator_1.body)("rideId").isMongoId().notEmpty().withMessage("Ride Id is required"),
    (0, express_validator_1.body)("otp")
        .isString()
        .isLength({ min: 6, max: 6 })
        .withMessage("Invalid OTP"),
];
exports.default = confirmRideByCaptainValidation;
