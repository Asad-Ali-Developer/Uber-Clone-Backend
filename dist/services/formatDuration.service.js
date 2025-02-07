"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatDuration = (durationInMinutes) => {
    if (durationInMinutes < 0) {
        throw new Error("Duration must be a non-negative number.");
    }
    const hours = Math.floor(durationInMinutes / 60); // Total hours
    const minutes = Math.round(durationInMinutes % 60); // Remaining minutes after hours
    // Handle cases with 0 hours and/or 0 minutes appropriately
    if (hours === 0 && minutes === 0) {
        return "less than a minute";
    }
    if (hours === 0) {
        return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
    if (minutes === 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
    return `${hours} hour${hours !== 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""}`;
};
exports.default = formatDuration;
