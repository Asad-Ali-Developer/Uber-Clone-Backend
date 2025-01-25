import { body } from "express-validator";

const confirmRideByCaptainValidation = [
  body("rideId").isMongoId().notEmpty().withMessage("Ride Id is required"),
  body("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
];

export default confirmRideByCaptainValidation;
