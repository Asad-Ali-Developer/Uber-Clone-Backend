import passport from "passport";
import { Request, Response, NextFunction } from "express";

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        // Handle unexpected errors
        return next(err);
      }
      if (!user) {
        // Handle missing or invalid user
        return res
          .status(401)
          .json({ message: "Unauthorized", error: info?.message });
      }
      req.user = user; // Attach the authenticated user to the request object
      req.userId = user; // Attach the authenticated user ID to the request object
      next();
    }
  )(req, res, next); // Invoke the middleware
};

export default authenticateUser;
