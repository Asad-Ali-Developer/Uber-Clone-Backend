import { yellow } from "colorette";
import mongoose from "mongoose";
import { logMessage } from "../services";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_OFFLINE!);
    // console.log("MongoDB connected successfully!");
    // console.log(yellow("[MongoDB] Connected successfully!"))
    logMessage("[MongoDB] MongoDB connected successfully!");
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;
