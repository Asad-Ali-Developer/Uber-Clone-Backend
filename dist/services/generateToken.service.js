"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (_id, email) => {
    const payload = { id: _id, email: email };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: "1d" };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.default = generateToken;
