"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeRideByCaptain = exports.startRideValidation = exports.confirmRideByCaptainValidation = exports.getFareValidation = exports.createRideValidation = exports.mapAddressingSuggestionsValidation = exports.mapDistanceTimeValidation = exports.mapQueryValidaiton = exports.loginCaptainValidation = exports.captainRegisterValidation = exports.authenticateUser = exports.loginValidation = exports.registerValidation = void 0;
// User Validations
const registerValidation_1 = __importDefault(require("./user/registerValidation"));
exports.registerValidation = registerValidation_1.default;
const loginValidation_1 = __importDefault(require("./user/loginValidation"));
exports.loginValidation = loginValidation_1.default;
const userValidation_1 = __importDefault(require("./user/userValidation"));
exports.authenticateUser = userValidation_1.default;
// Captain Validations
const captainRegisterValidation_1 = __importDefault(require("./captain/captainRegisterValidation"));
exports.captainRegisterValidation = captainRegisterValidation_1.default;
const loginCaptainValidation_1 = __importDefault(require("./captain/loginCaptainValidation"));
exports.loginCaptainValidation = loginCaptainValidation_1.default;
// Map Validations
const mapQueryValidaiton_1 = __importDefault(require("./map/mapQueryValidaiton"));
exports.mapQueryValidaiton = mapQueryValidaiton_1.default;
const mapDistanceTimeValidation_1 = __importDefault(require("./map/mapDistanceTimeValidation"));
exports.mapDistanceTimeValidation = mapDistanceTimeValidation_1.default;
const maAddressingSuggestions_validation_1 = __importDefault(require("./map/maAddressingSuggestions.validation"));
exports.mapAddressingSuggestionsValidation = maAddressingSuggestions_validation_1.default;
// Ride Validations
const createRide_validation_1 = __importDefault(require("./ride/createRide.validation"));
exports.createRideValidation = createRide_validation_1.default;
const getFare_validation_1 = __importDefault(require("./ride/getFare.validation"));
exports.getFareValidation = getFare_validation_1.default;
const confirmRideByCaptainValidation_validation_1 = __importDefault(require("./ride/confirmRideByCaptainValidation.validation"));
exports.confirmRideByCaptainValidation = confirmRideByCaptainValidation_validation_1.default;
const startRideValidation_1 = __importDefault(require("./ride/startRideValidation"));
exports.startRideValidation = startRideValidation_1.default;
const completeRideByCaptainValidation_1 = __importDefault(require("./ride/completeRideByCaptainValidation"));
exports.completeRideByCaptain = completeRideByCaptainValidation_1.default;
