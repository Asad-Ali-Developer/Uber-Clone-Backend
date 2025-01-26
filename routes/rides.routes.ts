import express from "express";
import rideController from "../controllers/ride.controller";
import { authCaptainMiddleware, authUserMiddleware } from "../middlewares";
import {
  completeRideByCaptain,
  confirmRideByCaptainValidation,
  createRideValidation,
  startRideValidation,
} from "../validations";
const router = express.Router();

const { createRide, getFare, confirmRideByCaptain, startRide, completeRide } =
  rideController;

router.post("/create", createRideValidation, authUserMiddleware, createRide);

router.get("/get-fare", authUserMiddleware, getFare);

router.post(
  "/confirm-ride-by-captain",
  confirmRideByCaptainValidation,
  authCaptainMiddleware,
  confirmRideByCaptain
);

router.post(
  "/start-ride",
  startRideValidation,
  authCaptainMiddleware,
  startRide
);

router.post(
  "/complete-ride",
  completeRideByCaptain,
  authCaptainMiddleware,
  completeRide
);

export default router;
