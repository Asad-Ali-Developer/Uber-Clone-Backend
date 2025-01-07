import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models"; // Assuming you have a userModel
import blacklistTokenModel from "../models/blacklistTokenModel"; // Assuming blacklistTokenModel exists

interface DecodedToken {
  email: string;
  id: string;
}

const authUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from cookies or authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "").trim();

    if (!token) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    // Check if the token is blacklisted
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      res.status(401).json({ message: "Token is blacklisted!" });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded?.email || !decoded?.id) {
      res.status(401).json({ message: "Invalid token!" });
      return;
    }

    // Find the user in the database
    const user = await userModel
      .findOne({ email: decoded.email })
      .select("-password"); // Exclude password for security

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    // Attach user to the request object
    req.user = user;

    req.userId = user._id.toString();
    console.log(req.userId);

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(401).json({ message: "Invalid token!" });
    return;
  }
};

export default authUserMiddleware;
