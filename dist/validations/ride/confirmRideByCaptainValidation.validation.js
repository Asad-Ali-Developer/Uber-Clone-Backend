"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const confirmRideByCaptainValidation = [
    (0, express_validator_1.body)("rideId").isMongoId().notEmpty().withMessage("Ride Id is required"),
    (0, express_validator_1.body)("captainId")
        .isMongoId()
        .notEmpty()
        .withMessage("Captain Id is required"),
];
exports.default = confirmRideByCaptainValidation;
