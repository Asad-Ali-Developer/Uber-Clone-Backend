"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const validations_1 = require("../validations");
const middlewares_1 = require("../middlewares");
const { register, login, User, logout } = controllers_1.userController;
const router = express_1.default.Router();
router.post("/register", validations_1.registerValidation, register);
router.post("/login", validations_1.loginValidation, login);
// router.get("/user", authenticateUser, (req: Request, res: Response) => {
//     res.json({
//       message: "User authenticated",
//       user: req.user,
//     });
//   });
// Protected route example
router.get('/profile', middlewares_1.authUserMiddleware, User); // Protect this route with authMiddleware
router.get('/logout', logout);
exports.default = router;
