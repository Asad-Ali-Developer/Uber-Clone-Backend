import { Server as HttpServer } from "http"; // Importing the HTTP Server
import { Server } from "socket.io";
import { captainModel, userModel } from "./models";

let io: Server;

const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;
      console.log(userId);

      if (userType === "user") {
        console.log(`User ${userId} joined with type ${userType}`);
        await userModel.findOneAndUpdate(userId, {
          socketId: socket.id,
        });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, {
          socketId: socket.id,
        });
      }

      socket.on("disconnect", () => {
        console.log("Client disconnected: ", socket.id);
      });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

const sendMessageToSocketId = (socketId: string, message: string) => {
  if (io) {
    io.to(socketId).emit("message", message);
  } else {
    console.error("Socket.io is not initialized.");
  }
};

export { initializeSocket, sendMessageToSocketId };
