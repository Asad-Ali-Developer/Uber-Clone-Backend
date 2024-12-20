import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import dotenv from "dotenv";
import { findUserById } from "../services";

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await findUserById(payload.id)

      if (user) {
        return done(null, user); // Pass user to request if authenticated
      }

      return done(null, false); // User not found
    } catch (error) {
      console.log(error);
      return done(error, false);
    }
  })
);

export default passport;
