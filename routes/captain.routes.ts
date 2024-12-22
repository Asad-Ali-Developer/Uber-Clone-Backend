import express from "express";
import {
  captainRegisterValidation,
  loginCaptainValidation,
} from "../validations";
import { captainController } from "../controllers";
import { authCaptainMiddleware } from "../middlewares";

const { createCaptain, loginCaptain, Captain, logoutCaptain } =
  captainController;

const router = express.Router();

router.post("/register", captainRegisterValidation, createCaptain);

router.post("/login", loginCaptainValidation, loginCaptain);

router.get("/profile", authCaptainMiddleware, Captain);

router.get("/logout", logoutCaptain);

export default router;
