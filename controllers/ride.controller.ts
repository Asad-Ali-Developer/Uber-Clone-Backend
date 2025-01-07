import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rideModel } from "../models";
import { fareCalculator, getGeocodeCoordinatesByAddress } from "../services";

const createRide = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination, vehicleType } = req.body;

  console.log(req.body);

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

    // Calculate fare for the ride
    const fare = await fareCalculator(
      originCoordinate,
      destinationCoordinate,
      vehicleType
    );

    // Create the ride record
    const ride = await rideModel.create({
      userId,
      origin,
      destination,
      fare,
    });

    // Send response with the ride data
    res.status(201).json({ message: "Ride created successfully", ride });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createRide;
