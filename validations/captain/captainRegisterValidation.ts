import { body } from "express-validator";

const captainRegisterValidation = [
  body("email").isEmail().withMessage("Invalid Email!"),
  body("fullName.firstName")
    .isLength({ min: 3 })
    .withMessage("First name must be atleast 3 characters long!"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should be atleast 6 characters!"),
  body("vehicle.color")
    .isLength({ min: 3 })
    .withMessage("Color should be atleast 3 characters!"),
  body("vehicle.plate")
    .isLength({ min: 3 })
    .withMessage("Color should be atleast 3 characters!"),
  body("vehicle.capacity")
    .isInt({ min: 1 })
    .withMessage("Color should be atleast 3 characters!"),
  body("vehicle.vehicleType")
    .isIn(["car", "bike", "auto"])
    .withMessage("Color should be atleast three characters!"),
];

export default captainRegisterValidation;
