import http from "http";
import app from "./index";
import { connectDB } from "./db";

const PORT = process.env.PORT;

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
})
