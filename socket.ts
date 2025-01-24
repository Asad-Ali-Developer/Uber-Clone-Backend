import { Server as HttpServer } from "http"; // Importing the HTTP Server
import { Server } from "socket.io";
import { captainModel, userModel } from "./models";

let io: Server;

enum userTypeEnum {
  user = "user",
  captain = "captain",
}

interface ContextDataComingType {
  userId: string;
  userType: userTypeEnum;
}

const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join", async (data: ContextDataComingType) => {
      const { userId, userType } = data;
      console.log(userId);

      if (!userId) {
        console.error("Invalid userId: ", userId);
        return;
      }

      if (!userType) {
        console.error("Invalid userType: ", userType);
        return;
      }

      try {
        if (userType === userTypeEnum.user) {
          console.log(`User ${userId} joined with type ${userType}`);
          await userModel.findOneAndUpdate(
            { _id: userId },
            {
              socketId: socket.id,
            }
          );
        } else if (userType === userTypeEnum.captain) {
          console.log(`User ${userId} joined with type ${userType}`);
          await captainModel.findOneAndUpdate(
            { _id: userId },
            {
              socketId: socket.id,
            }
          );
        }
      } catch (error) {
        console.log("Error updating the socketId:", error);
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
