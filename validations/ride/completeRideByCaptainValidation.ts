import { body } from "express-validator";

const completeRideByCaptain = [
  body("rideId").isMongoId().withMessage("Ride Id is required"),
];

export default completeRideByCaptain;
