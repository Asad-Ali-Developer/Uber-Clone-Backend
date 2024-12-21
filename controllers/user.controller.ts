import { Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import { blacklistTokenModel, userModel } from "../models";
import { comparePassword, generateToken, hashPassword } from "../services";

// Typing the handler as RequestHandler without returning Response
// Register functionality will be here.
const register: RequestHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; // ensure early return
  }

  const { fullName, email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      res.status(400).json({
        msg: "User already has been registered!",
      });
      return; // ensure early return
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userModel.create({
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName,
      },
      email,
      password: hashedPassword,
    });

    const sanitizedUser = {
      id: newUser.id,
      email: newUser.email,
    };

    const token = generateToken(newUser.id, newUser.email);

    res.status(201).json({
      msg: "User has been registered successfully!",
      token,
      newUser: sanitizedUser,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error!",
    });
  }
};

// Login Functionality ...
const login: RequestHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({
        msg: "User not found!",
      });
      return; // ensure early return
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({
        msg: "Invalid credentials!",
      });
      return; // ensure early return
    }

    const token = generateToken(user.id, user.email);

    const sanitizedUser = {
      id: user.id,
      email: user.email,
    };

    res.cookie("token", token);

    res.status(200).json({
      msg: "User has been logged in successfully!",
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error!",
    });
  }
};

const User: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userData = req.user;

    if (!userData) {
      res.status(400).json({
        msg: "User not found!",
      });
      return;
    }

    res.json({
      message: "User Authenticated Successfully!",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error!",
    });
  }
};

const logout: RequestHandler = async (req: Request, res: Response) => {
  try {
    const tokenFromCookie = req.cookies.token;
    const tokenFromHeader = req.headers.authorization
      ?.replace("Bearer ", "")
      .trim();

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      res.status(400).json({
        msg: "Token not found!",
      });
      return;
    }

    await blacklistTokenModel.create({ token });

    res.clearCookie("token");

    res.status(200).json({
      msg: "User has been logged out successfully!",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error!",
    });
  }
};

export default { register, login, User, logout };
