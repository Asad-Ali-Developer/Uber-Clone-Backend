import express from "express";
import { userController } from "../controllers";
import {
  loginValidation,
  registerValidation,
} from "../validations";
import { authUserMiddleware } from "../middlewares";


const { register, login, User, logout } = userController;

const router = express.Router();

router.post("/register", registerValidation, register);

router.post("/login", loginValidation, login);

// router.get("/user", authenticateUser, (req: Request, res: Response) => {
//     res.json({
//       message: "User authenticated",
//       user: req.user,
//     });
//   });

// Protected route example
router.get('/user', authUserMiddleware, User); // Protect this route with authMiddleware
router.get('/logout', logout);

export default router;
