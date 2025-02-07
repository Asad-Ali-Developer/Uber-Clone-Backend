"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const otpGenerator = (length) => {
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error("OTP length must be a positive integer");
    }
    // This is to make sure the generated OTP is a string
    let otp = '';
    const digits = '0123456789'; // Base set of valid OTP characters
    for (let i = 0; i < length; i++) {
        // Generate random index using Math.random()
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
};
exports.default = otpGenerator;
