import express from "express";
import { userController } from "../controllers";
import authMiddleware from "../middlewares/authMiddleware";
import {
  loginValidation,
  registerValidation,
} from "../validations";


const { register, login, User } = userController;

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
router.get('/user', authMiddleware, User); // Protect this route with authMiddleware

export default router;
