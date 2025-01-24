import { captainModel } from "../models";

/**
 * Finds captains within a specified radius of a given location.
 * @param lng - Longitude of the center point.
 * @param lat - Latitude of the center point.
 * @param radius - Radius in kilometers.
 * @returns A list of captains within the specified radius.
 */
const getCaptainsInTheRadius = async (
  lng: number,
  lat: number,
  radius: number // Radius in kilometers
) => {
  try {
    // Convert radius from kilometers to radians (Earth's radius in kilometers is 6378.1 km)
    const radiusInRadians = radius / 6378.1;

    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians],
        },
      },
    });

    return captains;
  } catch (error) {
    console.error("Error fetching captains within the radius:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export default getCaptainsInTheRadius;
