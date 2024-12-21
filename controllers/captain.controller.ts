import { Request, RequestHandler, Response } from "express";
import captainModel from "../models/captainModel";
import { comparePassword, generateToken, hashPassword } from "../services";
import { validationResult } from "express-validator";

const createCaptain: RequestHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array(),
    });
    return; // Early exit
  }

  const { fullName, email, password, vehicle } = req.body;
  // const { fullName: {firstName, lastName} = {}, email, password, vehicle : { color, plate, vehicleType, capacity } = {} } = req.body; // Both ways are perfectly fine.

  // Check for required fields
  if (!fullName || !email || !password || !vehicle) {
    res.status(400).json({
      message: "All required fields must be provided!",
    });
    return; // Early exit
  }

  try {
    // Check if the captain already exists
    const isCaptainExists = await captainModel.findOne({ email });

    if (isCaptainExists) {
      res.status(400).json({
        message: "Captain already exists!",
      });
      return; // Early exit
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new captain
    const newCaptain = await captainModel.create({
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName || "", // Default to an empty string if not provided
      },
      email,
      password: hashedPassword,
      vehicle: {
        color: vehicle.color,
        plate: vehicle.plate,
        vehicleType: vehicle.vehicleType,
        capacity: vehicle.capacity,
      },
    });

    // Generate a token
    const token = generateToken(newCaptain.id, newCaptain.email);

    // Send the response
    res.status(201).json({
      message: "Captain created successfully!",
      token,
      newCaptain,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      error: "Internal server error",
      details: error,
    });
  }
};

const loginCaptain: RequestHandler = async (req: Request, res: Response) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    res.status(400).json({
      errors: error.array(),
    });
    return;
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email });

  if(!captain){
    res.status(400).json({
      message: "Captain not found!",
    });
    return;
  }

  const isPasswordCorrect = await comparePassword(password, captain.password);

  if(!isPasswordCorrect){
    res.status(400).json({
      message: "Invalid Credentials!",
    });
    return;
  }

  const token = generateToken(captain.id, captain.email);

  res.cookie("token", token);

  res.status(200).json({
    message: "Captain logged in successfully!",
    token,
  });

};

export default { createCaptain, loginCaptain };
