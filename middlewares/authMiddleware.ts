// authMiddleware.ts
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { userModel } from "../models";

dotenv.config();

interface DecodedToken {
  email?: string;
  id?: string; // Ensure both fields are available for decoding
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    if (typeof token !== "string") {
      throw new Error("Invalid token format");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (decoded.email) {
      const userLogged = await userModel
        .findOne({ email: decoded.email })
        .select("-password");

      if (userLogged) {
        req.user = userLogged;
        return next(); // Proceed to the next middleware or route handler
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(401).json({ error: "Token verification failed" });
  }
};

export default authMiddleware;
