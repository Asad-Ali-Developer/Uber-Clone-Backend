import { Server as HttpServer } from "http"; // Importing the HTTP Server
import { Server } from "socket.io";
import { captainModel, userModel } from "./models";

let io: Server;

interface SocketJoinRoomDataType {
  userId: string;
  userType: "user" | "captain";
}

interface LocationCooridinates {
  lat: number;
  lng: number;
}

interface SocketUpdateCaptainLocation {
  userId: string;
  location: LocationCooridinates;
}

interface sendMessageToSocketIdData {
  event: string;
  data: any;
}

const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // console.log(`New client connected: ${socket.id}`);

    socket.on("joinRoom", async (data: SocketJoinRoomDataType) => {
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
          console.log(
            `User ${userId} joined with type '${userType}' with socketId: ${socket.id}`
          );
          await userModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        } else if (userType === "captain") {
          // For the captain connection
          console.log(
            `Captain ${userId} joined with type '${userType}' with socketId: ${socket.id}`
          );
          await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        }
      } catch (error) {
        console.log("Error updating the socketId:", error);
      }

      socket.on("disconnect", () => {
        console.log("Client disconnected with socketId: ", socket.id);
      });
    });

    socket.on(
      "update-captain-location",
      async (data: SocketUpdateCaptainLocation) => {
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
          await captainModel.findByIdAndUpdate(userId, {
            location: {
              lat: location.lat,
              lng: location.lng,
            },
          });
        } catch (error) {
          console.log("Error updating the location:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`Client disconnected with socketId: ${socket.id}`);
    });
  });
};

const sendMessageToSocketId = (
  socketId: string,
  message: sendMessageToSocketIdData
) => {
  if (io) {
    io.to(socketId).emit(message.event, message.data);
  } else {
    console.error("Socket.io is not initialized.");
  }
};

export { initializeSocket, sendMessageToSocketId };
