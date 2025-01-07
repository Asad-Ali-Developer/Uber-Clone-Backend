import { body } from "express-validator";

const createRideValidation = [
  body("origin").isString().notEmpty().withMessage("Origin is required"),
  body("destination")
    .isString()
    .notEmpty()
    .withMessage("Destination is required"),
  body("vehicleType")
    .isString()
    .isIn(["car", "auto", "bike"])
    .withMessage("Vehicle type is required"),
];

export default createRideValidation;
