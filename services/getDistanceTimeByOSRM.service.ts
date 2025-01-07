import axios from "axios";
import formatDuration from "./formatDuration.service";

const getDistanceTimeByOSRM = async (
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

export default getDistanceTimeByOSRM;
