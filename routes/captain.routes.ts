import { Router } from "express";
import { captainController } from "../controllers";
import { authCaptainMiddleware } from "../middlewares";
import {
  captainRegisterValidation,
  loginCaptainValidation,
} from "../validations";

const { createCaptain, loginCaptain, Captain, logoutCaptain } =
  captainController;

const router: Router = Router();

router.post("/register", captainRegisterValidation, createCaptain);

router.post("/login", loginCaptainValidation, loginCaptain);

router.get("/profile", authCaptainMiddleware, Captain);

router.get("/logout", logoutCaptain);

export default router;
