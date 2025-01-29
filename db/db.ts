import mongoose from "mongoose";
import { logMessage } from "../services";

const connectDB = async () => {
  try {
    // Changed the default setting to the MONGODB_URI environment variable
    await mongoose.connect(process.env.MONGODB_URI!);
    // console.log("MongoDB connected successfully!");
    // console.log(yellow("[MongoDB] Connected successfully!"))
    logMessage("[MongoDB] MongoDB connected successfully!");
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;
