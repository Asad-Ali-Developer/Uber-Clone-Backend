"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const getFareValidation = [
    (0, express_validator_1.query)("origin")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Origin address is required"),
    (0, express_validator_1.query)("destination")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Destination address is required"),
];
exports.default = getFareValidation;
