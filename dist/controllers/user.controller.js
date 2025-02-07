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
// Typing the handler as RequestHandler without returning Response
// Register functionality will be here.
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; // ensure early return
    }
    const { fullName, email, password } = req.body;
    try {
        const user = yield models_1.userModel.findOne({ email });
        if (user) {
            res.status(401).json({
                message: "User already exists!",
            });
            return; // ensure early return
        }
        const hashedPassword = yield (0, services_1.hashPassword)(password);
        const newUser = yield models_1.userModel.create({
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName,
            },
            email,
            password: hashedPassword,
        });
        const sanitizedUser = {
            id: newUser.id,
            email: newUser.email,
        };
        const token = (0, services_1.generateToken)(newUser.id, newUser.email);
        res.status(201).json({
            message: "User registered successfully!",
            token,
            newUser: sanitizedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Internal server error!",
        });
    }
});
// Login Functionality ...
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        const user = yield models_1.userModel.findOne({ email }).select("+password");
        if (!user) {
            res.status(400).json({
                message: "User not found!",
            });
            return; // ensure early return
        }
        const isPasswordCorrect = yield (0, services_1.comparePassword)(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).json({
                message: "Invalid credentials!",
            });
            return; // ensure early return
        }
        const token = (0, services_1.generateToken)(user.id, user.email);
        const sanitizedUser = {
            id: user.id,
            email: user.email,
        };
        res.cookie("token", token);
        res.status(200).json({
            message: "User logged in successfully!",
            token,
            user: sanitizedUser,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal server error!",
        });
    }
});
const User = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.user;
        if (!userData) {
            res.status(400).json({
                message: "User not found!",
            });
            return;
        }
        res.json({
            message: "User Authenticated Successfully!",
            user: req.user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!",
        });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tokenFromCookie = req.cookies.token;
        const tokenFromHeader = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "").trim();
        const token = tokenFromCookie || tokenFromHeader;
        if (!token) {
            res.status(400).json({
                message: "Token not found!",
            });
            return;
        }
        yield models_1.blacklistTokenModel.create({ token });
        res.clearCookie("token");
        res.status(200).json({
            message: "User logged out successfully!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!",
        });
    }
});
exports.default = { register, login, User, logout };
