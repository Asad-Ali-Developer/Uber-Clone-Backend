import { body } from "express-validator";

const confirmRideByCaptainValidation = [
  body("rideId").isMongoId().notEmpty().withMessage("Ride Id is required"),
  body("captainId")
    .isMongoId()
    .notEmpty()
    .withMessage("Captain Id is required"),
];

export default confirmRideByCaptainValidation;
