import axios from "axios";

type OSRMResponse = {
  distance: number; // Distance in kilometers or meters
  duration: number; // Duration in minutes or seconds
};

const getDistanceTimeOSRM = async (
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  vehicleType: string
): Promise<OSRMResponse> => {
  const url = `https://router.project-osrm.org/route/v1/${vehicleType}/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false&steps=false`;

  // profile: "driving" | "walking" | "cycling" = "cycling"

  const response = await axios.get(url);

  if (response.data.routes.length === 0) {
    throw new Error("No routes found between the given locations");
  }

  const { distance, duration } = response.data.routes[0];

  return {
    distance,
    duration,
  };
};

export default getDistanceTimeOSRM;
