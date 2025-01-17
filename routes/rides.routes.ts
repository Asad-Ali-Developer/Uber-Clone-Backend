import express from "express";
const router = express.Router();
import { createRideValidation } from "../validations";
import { authUserMiddleware } from "../middlewares";
import rideController from "../controllers/ride.controller";

const {createRide, getFare} = rideController;

router.post("/create", createRideValidation, authUserMiddleware, createRide);

router.get("/get-fare", authUserMiddleware, getFare);

export default router;
