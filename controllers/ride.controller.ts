import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rideModel } from "../models";
import {
  fareCalculator,
  formatDuration,
  getDistanceTimeOSRM,
  getGeocodeCoordinatesByAddress,
  otpGenerator,
} from "../services";

const createRide = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination, vehicleType } = req.body;

  // console.log(req.body);

  try {
    // Ensure userId is set by the authentication middleware
    const userId = req.userId; // User ID from auth middleware

    if (!userId) {
      res.status(400).json({ message: "User ID is missing" });
    }

    const originCoordinate = await getGeocodeCoordinatesByAddress(origin);
    const destinationCoordinate = await getGeocodeCoordinatesByAddress(
      destination
    );

    //  Calculate distance and time between origin and destination
    const { distance, duration } = await getDistanceTimeOSRM(
      originCoordinate,
      destinationCoordinate
    );

    // Calculate fare for the ride
    const fare = fareCalculator(distance, duration, vehicleType);

    // Create the ride record
    const ride = await rideModel.create({
      userId,
      origin,
      destination,
      fare,
      otp: otpGenerator(6),
    });

    const formattedDuration = formatDuration(duration);

    // Send response with the ride data
    res.status(201).json({
      message: "Ride created successfully",
      fare,
      ride,
      distance,
      duration,
      formattedDuration: formattedDuration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFare = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination } = req.query;

  try {
    const originCoordinate = await getGeocodeCoordinatesByAddress(
      origin as string
    );

    const destinationCoordinate = await getGeocodeCoordinatesByAddress(
      destination as string
    );

    //  Calculate distance and time between origin and destination
    const { distance, duration } = await getDistanceTimeOSRM(
      originCoordinate,
      destinationCoordinate
    );

    const formattedDuration = formatDuration(duration);

    // Calculate fare for the ride
    const fare = fareCalculator(distance, duration);

    res.status(200).json({
      message: "Fare calculated successfully",
      fare,
      distance,
      duration,
      formattedDuration
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { createRide, getFare };
