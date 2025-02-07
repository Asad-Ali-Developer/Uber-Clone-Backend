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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const captainModel_1 = __importDefault(require("../models/captainModel"));
const models_1 = require("../models");
const authCaptainMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Extract token from cookies or authorization header
        const tokenFromCookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        const tokenFromHeader = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]; // Both are good
        const token = tokenFromHeader || tokenFromCookie;
        if (!token) {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }
        const isTokenBlacklisted = yield models_1.blacklistTokenModel.findOne({ token });
        if (isTokenBlacklisted) {
            res.status(401).json({ message: "Token is blacklisted!" });
            return;
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.email) || !(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
            res.status(401).json({ message: "Unauthorized Captain!" });
            return;
        }
        // Check if captain exists in the database
        const captainLogged = yield captainModel_1.default
            .findOne({ email: decoded.email })
            .select("-password");
        if (!captainLogged) {
            res.status(404).json({ message: "Captain not found!" });
            return;
        }
        // Attach captain to the request object for subsequent middleware/routes
        req.captain = captainLogged;
        req.captainId = captainLogged._id.toString();
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error("Authorization error:", error);
        res.status(401).json({ message: "Invalid token!" });
    }
});
exports.default = authCaptainMiddleware;
