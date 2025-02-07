"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
const createCaptain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array(),
        });
        return; // Early exit
    }
    const { fullName, email, password, vehicle } = req.body;
    // const { fullName: {firstName, lastName} = {}, email, password, vehicle : { color, plate, vehicleType, capacity } = {} } = req.body; // Both ways are perfectly fine.
    // Check for required fields
    if (!fullName || !email || !password || !vehicle) {
        res.status(400).json({
            message: "All required fields must be provided!",
        });
        return; // Early exit
    }
    try {
        // Check if the captain already exists
        const isCaptainExists = yield models_1.captainModel.findOne({ email });
        if (isCaptainExists) {
            res.status(401).json({
                message: "Captain already exists!",
            });
            return; // Early exit
        }
        // Hash the password
        const hashedPassword = yield (0, services_1.hashPassword)(password);
        // Create the new captain
        const newCaptain = yield models_1.captainModel.create({
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName || "", // Default to an empty string if not provided
            },
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                vehicleType: vehicle.vehicleType,
                capacity: vehicle.capacity,
            },
        });
        // Generate a token
        const token = (0, services_1.generateToken)(newCaptain.id, newCaptain.email);
        const sanitizedCaptain = {
            id: newCaptain.id,
            email: newCaptain.email,
        };
        // Send the response
        res.status(201).json({
            message: "Captain created successfully!",
            token,
            captain: sanitizedCaptain,
        });
    }
    catch (error) {
        // Handle errors
        res.status(500).json({
            error: "Internal server error",
            details: error,
        });
    }
});
const loginCaptain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        res.status(400).json({
            errors: error.array(),
        });
        return;
    }
    const { email, password } = req.body;
    const captain = yield models_1.captainModel.findOne({ email });
    if (!captain) {
        res.status(400).json({
            message: "Captain not found!",
        });
        return;
    }
    const isPasswordCorrect = yield (0, services_1.comparePassword)(password, captain.password);
    if (!isPasswordCorrect) {
        res.status(401).json({
            message: "Invalid Credentials!",
        });
        return;
    }
    const token = (0, services_1.generateToken)(captain.id, captain.email);
    res.cookie("token", token);
    const sanitizedCaptain = {
        id: captain.id,
        email: captain.email,
    };
    res.status(200).json({
        message: "Captain logged in successfully!",
        token,
        captain: sanitizedCaptain,
    });
});
const Captain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const captainData = req.captain; // Accessing captain data from middleware
        if (!captainData) {
            res.status(400).json({
                message: "Captain not found!",
            });
            return;
        }
        res.status(200).json({
            message: "Captain Authenticated!",
            captain: captainData,
        });
    }
    catch (error) {
        console.error("Error in Captain controller:", error);
        res.status(500).json({
            message: "Internal server error!",
        });
    }
});
const logoutCaptain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tokenFromCookie = req.cookies.token;
        const tokenFromHeader = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "").trim();
        const token = tokenFromCookie || tokenFromHeader;
        yield models_1.blacklistTokenModel.create({ token });
        res.clearCookie("token");
        res.status(200).json({
            message: "Captain logged out successfully!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Unauthorized!",
        });
    }
});
exports.default = { createCaptain, loginCaptain, Captain, logoutCaptain };
