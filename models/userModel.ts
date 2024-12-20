import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
        minLength: [3, "First Name must be at least 3 characters long"],
      },
      lastName: {
        type: String,
        required: false,
        minLength: [3, "Last Name must be at least 3 characters long"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    socketId: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
