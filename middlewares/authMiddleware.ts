// authMiddleware.ts
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../services";
import { blacklistTokenModel, userModel } from "../models";

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

  // Get token from header or cookie
  const tokenFromHeader = req.headers.authorization?.replace("Bearer ", "").trim();
  const tokenFromCookie = req.cookies.token;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    res.status(401).json({ error: "No token, authorization denied" });
  }

  const isTokenBlacklisted = await userModel.findOne({ token });

  if (isTokenBlacklisted) {
    res.status(401).json({ error: "Token is blacklisted" });
  }

  try {
    if (typeof token !== "string") {
      throw new Error("Invalid token format");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (decoded.email) {
      const userLogged = await findUserById(decoded.id as string);

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
