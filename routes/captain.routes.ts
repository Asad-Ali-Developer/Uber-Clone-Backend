import express from "express";
import { captainRegisterValidation } from "../validations";
import { captainController } from "../controllers";

const { createCaptain } = captainController;

const router = express.Router();

router.post('/register', captainRegisterValidation, createCaptain)

export default router;