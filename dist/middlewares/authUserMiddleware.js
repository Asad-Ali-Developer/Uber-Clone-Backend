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
const models_1 = require("../models"); // Assuming you have a userModel
const blacklistTokenModel_1 = __importDefault(require("../models/blacklistTokenModel")); // Assuming blacklistTokenModel exists
const authUserMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Extract token from cookies or authorization header
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) ||
            ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "").trim());
        if (!token) {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }
        // Check if the token is blacklisted
        const isBlacklisted = yield blacklistTokenModel_1.default.findOne({ token });
        if (isBlacklisted) {
            res.status(401).json({ message: "Token is blacklisted!" });
            return;
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.email) || !(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
            res.status(401).json({ message: "Invalid token!" });
            return;
        }
        // Find the user in the database
        const user = yield models_1.userModel
            .findOne({ email: decoded.email })
            .select("-password"); // Exclude password for security
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        // Attach user to the request object
        req.user = user;
        req.userId = user._id.toString();
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error("Authorization error:", error);
        res.status(401).json({ message: "Invalid token!" });
        return;
    }
});
exports.default = authUserMiddleware;
