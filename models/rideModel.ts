import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
      required: false,
    },
    origin: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
    },
    destination: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "ongoing", "rejected", "completed"],
      default: "pending",
    },
    duration: {
      type: Number, // In Seconds
    },
    distance: {
      type: Number, // In Meters
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    signature: {
      type: String,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

const rideModel = mongoose.model("Ride", rideSchema);
export default rideModel;
