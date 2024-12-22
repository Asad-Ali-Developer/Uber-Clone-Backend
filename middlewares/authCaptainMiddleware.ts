import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import captainModel from "../models/captainModel";
import { blacklistTokenModel } from "../models";

interface DecodedToken {
  email: string;
  id: string;
}

const authCaptainMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from cookies or authorization header
    const tokenFromCookie = req.cookies?.token;
    const tokenFromHeader = req.headers.authorization
      ?.replace("Bearer ", "")
      .trim();

    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const isTokenBlacklisted = await blacklistTokenModel.findOne({ token });

    if (isTokenBlacklisted) {
      res.status(401).json({ message: "Token is blacklisted!" });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded?.email || !decoded?.id) {
      res.status(401).json({ message: "Unauthorized Captain!" });
      return;
    }

    // Check if captain exists in the database
    const captainLogged = await captainModel
      .findOne({ email: decoded.email })
      .select("-password");

    if (!captainLogged) {
      res.status(404).json({ message: "Captain not found!" });
      return;
    }

    // Attach captain to the request object for subsequent middleware/routes
    req.captain = captainLogged;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(401).json({ message: "Invalid token!" });
  }
};

export default authCaptainMiddleware;
