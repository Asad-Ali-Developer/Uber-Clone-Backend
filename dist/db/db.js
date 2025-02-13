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
const mongoose_1 = __importDefault(require("mongoose"));
const services_1 = require("../services");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Changed the default setting to the MONGODB_URI environment variable
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        // console.log("MongoDB connected successfully!");
        // console.log(yellow("[MongoDB] Connected successfully!"))
        (0, services_1.logMessage)("[MongoDB] MongoDB connected successfully!");
    }
    catch (error) {
        console.log(error);
        process.exit(1); // Exit the process if connection fails
    }
});
exports.default = connectDB;
