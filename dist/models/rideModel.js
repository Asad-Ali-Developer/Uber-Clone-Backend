"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const rideSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    captainId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Captain",
        required: false,
    },
    origin: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        enum: ["car", "auto", "bike"],
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "ongoing", "rejected", "completed"],
        default: "pending",
    },
    duration: {
        type: Number, // In Seconds
    },
    distance: {
        type: Number, // In Meters
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp: {
        type: String,
    },
}, { timestamps: true });
const rideModel = mongoose_1.default.model("Ride", rideSchema);
exports.default = rideModel;
