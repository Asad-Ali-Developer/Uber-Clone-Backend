import { query } from "express-validator";

const mapAddressingSuggestionsValidation = [
  query("address")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Address is required"),
];

export default mapAddressingSuggestionsValidation;
