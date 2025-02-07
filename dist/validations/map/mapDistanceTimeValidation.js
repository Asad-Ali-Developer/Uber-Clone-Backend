"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const mapDistanceTimeValidation = [
    (0, express_validator_1.query)("origin").isString().isLength({ min: 3 }),
    (0, express_validator_1.query)("destination").isString().isLength({ min: 3 }),
];
exports.default = mapDistanceTimeValidation;
