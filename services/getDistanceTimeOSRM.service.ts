import axios from "axios";

type OSRMResponse = {
  distance: number; // Distance in kilometers or meters
  duration: number; // Duration in minutes or seconds
};

const getDistanceTimeOSRM = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<OSRMResponse> => {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false&steps=false`;

  // profile: "driving" | "walking" | "cycling" = "cycling"

  const response = await axios.get(url);

  if (response.data.routes.length === 0) {
    throw new Error("No routes found between the given locations");
  }

  const { distance, duration } = response.data.routes[0];

  const distanceInKM = distance / 1000;
  const duraitonInMinutes = duration / 60;

  return {
    distance: Math.round(distanceInKM),
    duration: duraitonInMinutes,
  };
};

export default getDistanceTimeOSRM;
