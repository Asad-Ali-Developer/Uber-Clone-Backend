"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const captainRegisterValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email!"),
    (0, express_validator_1.body)("fullName.firstName")
        .isLength({ min: 3 })
        .withMessage("First name must be atleast 3 characters long!"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 3 })
        .withMessage("Password should be atleast 6 characters!"),
    (0, express_validator_1.body)("vehicle.color")
        .isLength({ min: 3 })
        .withMessage("Color should be atleast 3 characters!"),
    (0, express_validator_1.body)("vehicle.plate")
        .isLength({ min: 3 })
        .withMessage("Color should be atleast 3 characters!"),
    (0, express_validator_1.body)("vehicle.capacity")
        .isInt({ min: 1 })
        .withMessage("Color should be atleast 3 characters!"),
    (0, express_validator_1.body)("vehicle.vehicleType")
        .isIn(["car", "bike", "auto"])
        .withMessage("Color should be atleast three characters!"),
];
exports.default = captainRegisterValidation;
