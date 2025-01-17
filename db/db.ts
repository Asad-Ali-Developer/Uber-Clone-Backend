import { yellow } from "colorette";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    // console.log("MongoDB connected successfully!");
    console.log(yellow("[MongoDB] Connected successfully!"))
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;
