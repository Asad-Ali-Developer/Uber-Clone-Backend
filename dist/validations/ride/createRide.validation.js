"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const createRideValidation = [
    (0, express_validator_1.body)("origin").isString().notEmpty().withMessage("Origin is required"),
    (0, express_validator_1.body)("destination")
        .isString()
        .notEmpty()
        .withMessage("Destination is required"),
    (0, express_validator_1.body)("vehicleType")
        .isString()
        .isIn(["car", "auto", "bike"])
        .withMessage("Vehicle type is required"),
];
exports.default = createRideValidation;
