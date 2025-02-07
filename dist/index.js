"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("./config/passportJWTStrategy");
const routes_1 = require("./routes");
const services_1 = require("./services");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
// Because of this, we will be expecting json file in the response
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Initialize passport middleware to use JWT strategy for authentication
app.use(passport_1.default.initialize());
app.use("/api/users", routes_1.userRoutes);
app.use("/api/captains", routes_1.captainRoutes);
app.use("/api/maps", routes_1.mapRoutes);
app.use("/api/rides", routes_1.ridesRoutes);
// Function to log all routes
(0, services_1.listRoutes)(app);
app.get("/", (req, res) => {
    res.send("Hello World with TypeScript!");
});
exports.default = app;
