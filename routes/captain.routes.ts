import express from "express";
import { captainRegisterValidation, loginCaptainValidation } from "../validations";
import { captainController } from "../controllers";

const { createCaptain, loginCaptain } = captainController;

const router = express.Router();

router.post('/register', captainRegisterValidation, createCaptain)

router.post('/login', loginCaptainValidation, loginCaptain)

export default router;