"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const authenticateUser = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
            // Handle unexpected errors
            return next(err);
        }
        if (!user) {
            // Handle missing or invalid user
            return res
                .status(401)
                .json({ message: "Unauthorized", error: info === null || info === void 0 ? void 0 : info.message });
        }
        req.user = user; // Attach the authenticated user to the request object
        req.userId = user; // Attach the authenticated user ID to the request object
        next();
    })(req, res, next); // Invoke the middleware
};
exports.default = authenticateUser;
