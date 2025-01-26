import { body } from "express-validator";

const startRideValidation = [
  body("rideId").isMongoId().withMessage("Ride Id is required"),
  body("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP is required"),
];

export default startRideValidation;
