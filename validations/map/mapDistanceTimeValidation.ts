import { query } from "express-validator";

const mapDistanceTimeValidation = [
  query("origin").isString().isLength({ min: 3 }),
  query("destination").isString().isLength({ min: 3 }),
];

export default mapDistanceTimeValidation;