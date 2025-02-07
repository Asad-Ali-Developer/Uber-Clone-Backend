"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const mapAddressingSuggestionsValidation = [
    (0, express_validator_1.query)("address")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Address is required"),
];
exports.default = mapAddressingSuggestionsValidation;
