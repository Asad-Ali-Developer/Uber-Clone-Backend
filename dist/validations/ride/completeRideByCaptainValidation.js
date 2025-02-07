"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const completeRideByCaptain = [
    (0, express_validator_1.body)("rideId").isMongoId().withMessage("Ride Id is required"),
];
exports.default = completeRideByCaptain;
