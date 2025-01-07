import express from "express";
const router = express.Router();
import { createRideValidation } from "../validations";
import { authUserMiddleware } from "../middlewares";

router.post("/create", createRideValidation, authUserMiddleware);

export default router;
