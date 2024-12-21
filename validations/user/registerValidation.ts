import { body } from "express-validator";

const registerValidation = [
  body("fullName.firstName")
    .isLength({ min: 3 })
    .withMessage("First Name must be at least 3 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export default registerValidation;
