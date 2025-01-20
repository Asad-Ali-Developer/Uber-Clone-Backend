import http from "http";
import app from "./index";
import { connectDB } from "./db";
import { logMessage } from "./services";
import { initializeSocket } from "./socket";

const PORT = process.env.PORT;

const server = http.createServer(app);

initializeSocket(server);

connectDB().then(() => {
  server.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
    logMessage("[UberApplication] Uber application successfully started");
  });
});
