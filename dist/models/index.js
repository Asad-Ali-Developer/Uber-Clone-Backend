"use strict";
// All the imports and exports of the models will be here
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideModel = exports.captainModel = exports.blacklistTokenModel = exports.userModel = void 0;
const userModel_1 = __importDefault(require("./userModel"));
exports.userModel = userModel_1.default;
const blacklistTokenModel_1 = __importDefault(require("./blacklistTokenModel"));
exports.blacklistTokenModel = blacklistTokenModel_1.default;
const captainModel_1 = __importDefault(require("./captainModel"));
exports.captainModel = captainModel_1.default;
const rideModel_1 = __importDefault(require("./rideModel"));
exports.rideModel = rideModel_1.default;
