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
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
const services_1 = require("../services");
const socket_1 = require("../socket");
const createRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination, vehicleType } = req.body;
    // console.log(req.body);
    try {
        // Ensure userId is set by the authentication middleware
        const userId = req.userId; // User ID from auth middleware
        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
        }
        const originCoordinate = yield (0, services_1.getGeocodeCoordinatesByAddress)(origin);
        const destinationCoordinate = yield (0, services_1.getGeocodeCoordinatesByAddress)(destination);
        //  Calculate distance and time between origin and destination
        const { distance, duration } = yield (0, services_1.getDistanceTimeOSRM)(originCoordinate, destinationCoordinate);
        // Calculate fare for the ride
        const fare = (0, services_1.fareCalculator)(distance, duration, vehicleType);
        // Create the ride record
        const ride = yield models_1.rideModel.create({
            userId,
            origin,
            destination,
            fare,
            otp: (0, services_1.otpGenerator)(6),
            vehicleType,
        });
        const formattedDuration = (0, services_1.formatDuration)(duration);
        // Send response with the ride data
        res.status(201).json({
            message: "Ride created successfully",
            fare,
            ride,
            distance,
            duration,
            formattedDuration: formattedDuration,
        });
        // Logics for getting Captains in the specific Radius
        const captainsInRadious = yield (0, services_1.getCaptainInTheRadius)(originCoordinate.lat, originCoordinate.lng, 10);
        const rideWithoutOtp = ride.toObject();
        delete rideWithoutOtp.otp;
        const rideWithUser = yield models_1.rideModel
            .findOne({ _id: ride.id })
            .populate("userId")
            .setOptions({ strictPopulate: false });
        // console.log(rideWithUser);
        captainsInRadious.map((captain) => {
            // console.log(captain, rideWithoutOtp);
            const captainSocketId = captain.socketId;
            (0, socket_1.sendMessageToSocketId)(captainSocketId, {
                event: "new-ride",
                data: {
                    rideWithUser,
                    distance,
                    duration,
                    formattedDuration,
                },
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const getFare = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;
    try {
        const originCoordinate = yield (0, services_1.getGeocodeCoordinatesByAddress)(origin);
        const destinationCoordinate = yield (0, services_1.getGeocodeCoordinatesByAddress)(destination);
        //  Calculate distance and time between origin and destination
        const { distance, duration } = yield (0, services_1.getDistanceTimeOSRM)(originCoordinate, destinationCoordinate);
        const formattedDuration = (0, services_1.formatDuration)(duration);
        // Calculate fare for the ride
        const fare = (0, services_1.fareCalculator)(distance, duration);
        res.status(200).json({
            message: "Fare calculated successfully",
            fare,
            distance,
            duration,
            formattedDuration,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
const confirmRideByCaptain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { rideId, captainId } = req.body;
    try {
        if (!rideId) {
            res.status(400).json({ message: "Ride ID is missing" });
            return;
        }
        yield models_1.rideModel.findByIdAndUpdate(rideId, { status: "accepted", captainId: captainId }, { new: true });
        const updatedRide = yield models_1.rideModel.findById(rideId);
        const userId = ((_a = updatedRide === null || updatedRide === void 0 ? void 0 : updatedRide.userId) === null || _a === void 0 ? void 0 : _a._id.toString()) || "";
        const rideUser = yield models_1.userModel.findById(userId).select("-password");
        const userSocketId = (rideUser === null || rideUser === void 0 ? void 0 : rideUser.socketId) || "";
        const captain = yield models_1.captainModel.findById(captainId).select("-password");
        (0, socket_1.sendMessageToSocketId)(userSocketId, {
            event: "confirm-ride-by-captain",
            data: {
                updatedRide,
                captain,
                rideUser,
            },
        });
        if (!updatedRide) {
            res.status(404).json({ message: "Ride not found" });
            return;
        }
        res.status(200).json({
            message: "Ride confirmed successfully",
            updatedRide,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const startRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { otp, rideId } = req.body;
    console.log(rideId, otp);
    if (!rideId) {
        res.status(400).json({ message: "Ride ID is missing" });
        return;
    }
    if (!otp) {
        res.status(400).json({ message: "OTP is missing" });
        return;
    }
    try {
        const ride = yield models_1.rideModel.findById(rideId);
        if (!ride) {
            res.status(404).json({ message: "Ride not found" });
            return;
        }
        const matchedOtp = ride.otp === otp;
        if (!matchedOtp) {
            res.status(400).json({ message: "Invalid OTP" });
            return;
        }
        if (matchedOtp) {
            yield models_1.rideModel.findByIdAndUpdate(rideId, { status: "onGoing" }, { new: true });
        }
        const userId = ((_a = ride === null || ride === void 0 ? void 0 : ride.userId) === null || _a === void 0 ? void 0 : _a._id.toString()) || "";
        const rideUser = yield models_1.userModel.findById(userId).select("-password");
        const userSocketId = (rideUser === null || rideUser === void 0 ? void 0 : rideUser.socketId) || "";
        console.log(userSocketId);
        (0, socket_1.sendMessageToSocketId)(userSocketId, {
            event: "ride-started",
            data: {
                ride,
                rideUser,
            },
        });
        res
            .status(200)
            .json({ message: "Ride started successfully", ride, rideUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const completeRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;
    console.log(rideId);
    if (!rideId) {
        res.status(400).json({ message: "Ride ID is missing" });
        return;
    }
    try {
        yield models_1.rideModel.findByIdAndUpdate(rideId, {
            status: "completed",
            captainId: req.captainId,
        }, { new: true });
        const ride = yield models_1.rideModel.findById(rideId);
        const userId = ((_a = ride === null || ride === void 0 ? void 0 : ride.userId) === null || _a === void 0 ? void 0 : _a._id.toString()) || "";
        const rideUser = yield models_1.userModel.findById(userId).select("-password");
        const userSocketId = (rideUser === null || rideUser === void 0 ? void 0 : rideUser.socketId) || "";
        (0, socket_1.sendMessageToSocketId)(userSocketId, {
            event: "ride-completed",
            data: {
                ride,
                rideUser,
                messageNotification: "Ride Completed!",
            },
        });
        res
            .status(200)
            .json({ message: "Ride Completed!", ride, rideUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = {
    createRide,
    getFare,
    confirmRideByCaptain,
    startRide,
    completeRide,
};
