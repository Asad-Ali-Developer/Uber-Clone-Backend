"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./index"));
const db_1 = require("./db");
const services_1 = require("./services");
const socket_1 = require("./socket");
const PORT = process.env.PORT;
const server = http_1.default.createServer(index_1.default);
(0, socket_1.initializeSocket)(server);
(0, db_1.connectDB)().then(() => {
    server.listen(PORT, () => {
        // console.log(`Server is running on port ${PORT}`);
        (0, services_1.logMessage)("[UberApplication] Uber application successfully started");
    });
});
