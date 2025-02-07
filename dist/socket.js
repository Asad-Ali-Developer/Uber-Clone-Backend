"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToSocketId = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const models_1 = require("./models");
let io;
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173", // Frontend URL
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        // console.log(`New client connected: ${socket.id}`);
        socket.on("joinRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { userId, userType } = data;
            if (!userId) {
                console.error("Invalid userId: ", userId);
                return;
            }
            if (!userType) {
                console.error("Invalid userType: ", userType);
                return;
            }
            try {
                if (userType === "user") {
                    // For the user connection
                    console.log(`User ${userId} joined with type '${userType}' with socketId: ${socket.id}`);
                    yield models_1.userModel.findByIdAndUpdate(userId, {
                        socketId: socket.id,
                    });
                }
                else if (userType === "captain") {
                    // For the captain connection
                    console.log(`Captain ${userId} joined with type '${userType}' with socketId: ${socket.id}`);
                    yield models_1.captainModel.findByIdAndUpdate(userId, {
                        socketId: socket.id,
                    });
                }
            }
            catch (error) {
                console.log("Error updating the socketId:", error);
            }
            socket.on("disconnect", () => {
                console.log("Client disconnected with socketId: ", socket.id);
            });
        }));
        socket.on("update-captain-location", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { userId, location } = data;
            if (!userId) {
                console.error("Invalid userId: ", userId);
                return;
            }
            if (!location) {
                console.error("Invalid location: ", location);
                return;
            }
            // console.log(location)
            try {
                yield models_1.captainModel.findByIdAndUpdate(userId, {
                    location: {
                        lat: location.lat,
                        lng: location.lng,
                    },
                });
            }
            catch (error) {
                console.log("Error updating the location:", error);
            }
        }));
        socket.on("disconnect", () => {
            console.log(`Client disconnected with socketId: ${socket.id}`);
        });
    });
};
exports.initializeSocket = initializeSocket;
const sendMessageToSocketId = (socketId, message) => {
    if (io) {
        io.to(socketId).emit(message.event, message.data);
    }
    else {
        console.error("Socket.io is not initialized.");
    }
};
exports.sendMessageToSocketId = sendMessageToSocketId;
