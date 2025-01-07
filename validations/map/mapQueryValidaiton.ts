import { query } from "express-validator";

const mapQueryValidaiton = [
  query("address")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Address is required"),
];

export default mapQueryValidaiton;
