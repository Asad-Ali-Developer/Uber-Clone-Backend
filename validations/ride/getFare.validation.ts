import { query } from "express-validator";

const getFareValidation = [
  query("origin")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Origin address is required"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Destination address is required"),
];

export default getFareValidation;
