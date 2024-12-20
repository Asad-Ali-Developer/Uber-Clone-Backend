import express, { Request, Response } from "express";
import { userController } from "../controllers";
import {
  authenticateUser,
  loginValidation,
  registerValidation,
} from "../validations";


const { register, login } = userController;

const router = express.Router();

router.post("/register", registerValidation, register);

router.post("/login", loginValidation, login);

router.get("/user", authenticateUser, (req: Request, res: Response) => {
    res.json({
      message: "User authenticated",
      user: req.user,
    });
  });
  

export default router;
