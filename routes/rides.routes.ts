import express from "express";
const router = express.Router();
import { createRideValidation } from "../validations";
import { authUserMiddleware } from "../middlewares";
import { createRide } from "../controllers";

router.post("/create", createRideValidation, authUserMiddleware, createRide);

export default router;
