import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();

interface ResponseType {
  data: {
    results: any[];
  };
}

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

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

  const url = `https://api.opencagedata.com/geocode/v1/json`;

  try {
    const response: ResponseType = await axios.get(url, {
      params: {
        key: OPENCAGE_API_KEY,
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

// const getAddressCoordinate = async (req: Request, res: Response) => {
//   // Validate query parameters
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { address } = req.query;

//   if (!address || typeof address !== "string") {
//     return res.status(400).json({
//       error: "Address query parameter is required and must be a string",
//     });
//   }

//   try {
//     // Use Nominatim (or other geocoding service) to get coordinates from an address
//     const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//       address
//     )}`;
//     const geocodeResponse = await axios.get(geocodeUrl);

//     if (geocodeResponse.data.length > 0) {
//       const { lat, lon, display_name } = geocodeResponse.data[0]; // Get latitude and longitude
//       return res.json({ lat, lon, display_name }); // Send the coordinates back as a response
//     } else {
//       return res.status(404).json({ error: "Address not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching coordinates:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Haversine formula to calculate the distance between two coordinates
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Helper function to geocode an address
const geocodeAddress = async (address: string) => {
  const url = `https://api.opencagedata.com/geocode/v1/json`;
  const response = await axios.get(url, {
    params: {
      key: OPENCAGE_API_KEY,
      q: address,
      limit: 1,
    },
  });

  if (response.data.results.length === 0) {
    throw new Error("No results found for the address");
  }

  const { lat, lng } = response.data.results[0].geometry;
  const { formatted } = response.data.results[0];
  return { lat, lon: lng, location: formatted }; // Rename 'lng' to 'lon' for consistency
};

const formatDuration = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600); // 3600 seconds in an hour
  const minutes = Math.floor((durationInSeconds % 3600) / 60); // Remaining minutes after hours are accounted for

  // Return formatted duration
  return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
    minutes !== 1 ? "s" : ""
  }`;
};

const getTravelDetailsOSRM = async (
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  vehicleType: string
) => {
  const url = `https://router.project-osrm.org/route/v1/${vehicleType}/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false&steps=false`;

  // profile: "driving" | "walking" | "cycling" = "cycling"

  const response = await axios.get(url);

  if (response.data.routes.length === 0) {
    throw new Error("No routes found between the given locations");
  }

  const { distance, duration } = response.data.routes[0];

  const formattedDuration = formatDuration(duration);

  return {
    distance: (distance / 1000).toFixed(2), // Convert meters to kilometers
    duration: formattedDuration, // Convert seconds to minutes
  };
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

  const { origin, destination, vehicleType } = req.query;
  // profile: "driving" | "walking" | "cycling" = "cycling"

  if (!origin || !destination) {
    res
      .status(400)
      .json({ error: "Both origin and destination addresses are required" });
    return;
  }

  try {
    // Geocode origin and destination
    const originCoordinates = await geocodeAddress(origin as string);
    const destinationCoordinates = await geocodeAddress(destination as string);

    // profile: "driving" | "walking" | "cycling" = "cycling"
    const { distance, duration } = await getTravelDetailsOSRM(
      originCoordinates,
      destinationCoordinates,
      vehicleType as string
    );

    // Calculate distance using the Haversine formula
    const distanced = haversineDistance(
      originCoordinates.lat,
      originCoordinates.lon,
      destinationCoordinates.lat,
      destinationCoordinates.lon
    );

    res.status(200).json({
      distance: distanced.toFixed(2), // Distance in kilometers
      origin: originCoordinates,
      destination: destinationCoordinates,
      distanceByOSRM: distance,
      durationByOSRM: duration,
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
