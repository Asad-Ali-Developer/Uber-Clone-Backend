"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
// Custom logger configuration
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), // Add timestamp to logs
    winston_1.default.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`; // Custom log format
    })),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), // Adds color to console output
            winston_1.default.format.simple() // Log in a simple format
            )
        }), // Log to console with color
        new winston_1.default.transports.File({
            filename: 'logs/app.log', // Log to file
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.simple())
        })
    ]
});
exports.default = logger;
