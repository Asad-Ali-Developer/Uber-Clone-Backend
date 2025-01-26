import express from "express";
import rideController from "../controllers/ride.controller";
import { authCaptainMiddleware, authUserMiddleware } from "../middlewares";
import {
    confirmRideByCaptainValidation,
    createRideValidation,
} from "../validations";
const router = express.Router();

const { createRide, getFare, confirmRideByCaptain } = rideController;

router.post("/create", createRideValidation, authUserMiddleware, createRide);

router.get("/get-fare", authUserMiddleware, getFare);

router.post(
  "/confirm-ride-by-captain",
  confirmRideByCaptainValidation,
  authCaptainMiddleware,
  confirmRideByCaptain
);

export default router;
