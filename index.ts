import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import passport from "passport";
import "./config/passportJWTStrategy";
import { captainRoutes, mapRoutes, ridesRoutes, userRoutes } from "./routes";
import { listRoutes } from "./services";
const app: Express = express();

dotenv.config();

app.use(cors());

// Because of this, we will be expecting json file in the response
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Initialize passport middleware to use JWT strategy for authentication
app.use(passport.initialize());

app.use("/api/users", userRoutes);

app.use("/api/captains", captainRoutes);

app.use("/api/maps", mapRoutes);

app.use("/api/rides", ridesRoutes);

// Function to log all routes
listRoutes(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World with TypeScript!");
});

export default app;
