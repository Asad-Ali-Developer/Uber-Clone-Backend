"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ridesRoutes = exports.mapRoutes = exports.captainRoutes = exports.userRoutes = void 0;
const user_routes_1 = __importDefault(require("./user.routes"));
exports.userRoutes = user_routes_1.default;
const captain_routes_1 = __importDefault(require("./captain.routes"));
exports.captainRoutes = captain_routes_1.default;
const maps_routes_1 = __importDefault(require("./maps.routes"));
exports.mapRoutes = maps_routes_1.default;
const rides_routes_1 = __importDefault(require("./rides.routes"));
exports.ridesRoutes = rides_routes_1.default;
