import axios from "axios";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  formatDuration,
  getDistanceTimeOSRM,
  getGeocodeCoordinatesByAddress,
  haversineDistance,
} from "../services";
dotenv.config();

interface ResponseType {
  data: {
    results: any[];
  };
}

// Controller to get coordinates from an address
const getAddressCoordinate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Validate query parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { address } = req.query;

  if (!address || typeof address !== "string") {
    res.status(400).json({
      error: "Address query parameter is required and must be a string",
    });
    return;
  }

  const url = process.env.OPENCAGE_URL!;

  try {
    const response: ResponseType = await axios.get(url, {
      params: {
        key: process.env.OPENCAGE_API_KEY,
        q: address,
        limit: 1,
        no_annotations: 1,
      },
    });

    if (response.data.results.length > 0) {
      const result = response.data.results[0];
      const { lat, lng } = result.geometry;
      const { formatted } = result;

      res.status(200).json({
        lat,
        lng,
        location: formatted,
      });
    } else {
      res
        .status(404)
        .json({ error: "No results found for the provided address" });
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    next(error);
  }
};

// Controller to get distance and travel time between two addresses
const getDistanceAndTime = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { origin, destination } = req.query;
  // profile: "driving" | "walking" | "cycling" = "cycling"

  if (!origin || !destination) {
    res
      .status(400)
      .json({ error: "Both origin and destination addresses are required" });
    return;
  }

  try {
    // Geocode origin and destination
    const originCoordinates = await getGeocodeCoordinatesByAddress(
      origin as string
    );
    const destinationCoordinates = await getGeocodeCoordinatesByAddress(
      destination as string
    );

    // profile: "driving" | "walking" | "cycling" = "cycling"
    const { distance, duration } = await getDistanceTimeOSRM(
      originCoordinates,
      destinationCoordinates
    );

    // Calculate distance using the Haversine formula
    const distanced = haversineDistance(
      originCoordinates.lat,
      originCoordinates.lng,
      destinationCoordinates.lat,
      destinationCoordinates.lng
    );

    const formattedDurationForORSM = formatDuration(duration);

    res.status(200).json({
      distance: distanced.toFixed(2), // Distance in kilometers
      origin: originCoordinates,
      destination: destinationCoordinates,
      distanceByOSRM: distance,
      durationByOSRM: formattedDurationForORSM,
    });
  } catch (error) {
    console.error("Error calculating distance and time:", error);
    next(error);
  }
};

const getAddressSuggestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Validate query parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { address } = req.query;

  if (!address || typeof address !== "string") {
    res.status(400).json({
      error: "Address query parameter is required and must be a string",
    });
    return;
  }

  try {
    // Use Nominatim (OpenStreetMap) API to get address suggestions based on input
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}&addressdetails=1&limit=5`;

    const geocodeResponse = await axios.get(geocodeUrl, {
      headers: {
        "Accept-Language": "en",
      },
    });

    // Check if we have results
    if (geocodeResponse.data.length > 0) {
      const suggestions = geocodeResponse.data.map((item: any) => ({
        label: item.display_name, // Full address display
        latitude: item.lat,
        longitude: item.lon,
      }));

      // Return suggestions
      res.status(200).json({ suggestions });
    } else {
      res.status(404).json({ message: "No address suggestions found" });
    }
  } catch (error) {
    console.error("Error fetching address suggestions:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching suggestions" });
  }
};

export default {
  getAddressCoordinate,
  getDistanceAndTime,
  getAddressSuggestions,
};
