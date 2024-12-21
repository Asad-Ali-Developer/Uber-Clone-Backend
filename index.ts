import express, { Request, Response, Express } from "express";
const app: Express = express();
import dotenv from "dotenv";
import cors from "cors";
import { userRoutes } from "./routes";
import passport from "passport";
import "./config/passportJWTStrategy";
import cookieParser from "cookie-parser";

dotenv.config();

app.use(cors());

// Because of this, we will be expecting json file in the response
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Initialize passport middleware to use JWT strategy for authentication
app.use(passport.initialize());

app.use("/api", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World with TypeScript!");
});

export default app;
