import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const getGeocodeCoordinatesByAddress = async (address: string) => {
  const url = `https://api.opencagedata.com/geocode/v1/json`;
  const response = await axios.get(url, {
    params: {
      key: process.env.OPENCAGE_API_KEY,
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

export default getGeocodeCoordinatesByAddress;
