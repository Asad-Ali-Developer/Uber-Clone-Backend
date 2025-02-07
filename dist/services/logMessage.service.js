"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colorette_1 = require("colorette");
const dayjs_1 = __importDefault(require("dayjs"));
// Custom logger function to mimic NestJS-style logs
const logMessage = (message, type = "LOG") => {
    const timestamp = (0, dayjs_1.default)().format("MM/DD/YYYY, hh:mm:ss A");
    const pid = process.pid; // Process ID for the application
    // Format specific parts of the message
    const formattedTimestamp = (0, colorette_1.white)(timestamp); // Timestamp in white
    const formattedPrefix = (0, colorette_1.green)(`[Uber] ${pid}`); // Prefix in green
    const formattedType = type === "LOG" ? (0, colorette_1.green)(type) : (0, colorette_1.yellow)(type); // Log type dynamically colored
    // Format the message: Highlight "[RouterExplorer]", "[MongoDB]", and "[UberApplication]" in yellow while keeping the rest green
    const formattedMessage = message
        .split(/(\[RouterExplorer\]|\[MongoDB\]|\[UberApplication\])/g) // Split on either "[RouterExplorer]", "[MongoDB]" or "[UberApplication]"
        .map((part) => {
        if (part === "[RouterExplorer]" ||
            part === "[MongoDB]" ||
            part === "[UberApplication]") {
            return (0, colorette_1.yellow)(part); // Highlight these parts in yellow
        }
        else {
            return (0, colorette_1.green)(part); // Keep the rest of the message in green
        }
    })
        .join("");
    // Combine all components
    const finalMessage = `${formattedPrefix}  -  ${formattedTimestamp}   ${formattedType} ${formattedMessage}`;
    // Output the log
    console.log(finalMessage);
};
exports.default = logMessage;
