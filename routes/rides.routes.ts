import express from "express";
const router = express.Router();
import { confirmRideByCaptainValidation, createRideValidation } from "../validations";
import { authUserMiddleware } from "../middlewares";
import rideController from "../controllers/ride.controller";

const { createRide, getFare, confirmRideByCaptain } = rideController;

router.post("/create", createRideValidation, authUserMiddleware, createRide);

router.get("/get-fare", authUserMiddleware, getFare);

router.post("/confirm-ride-by-captain", confirmRideByCaptainValidation, authUserMiddleware, confirmRideByCaptain);

export default router;
