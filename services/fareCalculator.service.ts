import getDistanceTimeOSRM from "./getDistanceTimeOSRM.service";

type FareRates = {
  [vehicleType: string]: {
    baseFare: number;
    perKmRate: number;
    perMinuteRate: number;
  };
};

// Fare rates for different vehicle types
const fareRates: FareRates = {
  car: {
    baseFare: 100, // Base fare in your currency
    perKmRate: 10, // Per kilometer rate
    perMinuteRate: 2, // Per minute rate
  },
  bike: {
    baseFare: 50,
    perKmRate: 15,
    perMinuteRate: 3,
  },
  auto: {
    baseFare: 40,
    perKmRate: 5,
    perMinuteRate: 1,
  },
};

const fareCalculator = async (
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  vehicleType: string
) => {
  const results: { [vehicleType: string]: number } = {}; // Object to hold fares for all vehicle types

  // Get the distance and duration from OSRM service
  const { distance, duration } = await getDistanceTimeOSRM(
    origin,
    destination,
    vehicleType
  );

  if (typeof distance !== "number" || typeof duration !== "number") {
    throw new Error("Invalid distance or duration returned from OSRM service");
  }

  // Iterate over each vehicle type to calculate fares
  for (const vehicleType in fareRates) {
    const rates = fareRates[vehicleType];

    // Calculate the fare for this vehicle type
    const totalFare =
      rates.baseFare +
      distance * rates.perKmRate +
      duration * rates.perMinuteRate;

    // Store the calculated fare in the results object
    results[vehicleType] = Math.round(totalFare); // Round the fare
  }

  return results; // Return an object containing fares for all vehicle types
};

export default fareCalculator;
