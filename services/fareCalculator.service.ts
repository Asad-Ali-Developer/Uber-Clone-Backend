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
    baseFare: 150,
    perKmRate: 30,
    perMinuteRate: 10,
  },
  bike: {
    baseFare: 50,
    perKmRate: 10,
    perMinuteRate: 2,
  },
  auto: {
    baseFare: 40,
    perKmRate: 5,
    perMinuteRate: 1,
  },
};

const fareCalculator = (
  distance: number, // Distance in kilometers
  duration: number, // Duration in minutes
  vehicleType: string // Vehicle type (e.g., "car", "bike", "auto")
): number => {
  // Validate inputs
  if (typeof distance !== "number" || distance <= 0) {
    throw new Error("Invalid distance value provided");
  }

  console.log(distance / 1000);

  if (typeof duration !== "number" || duration < 0) {
    throw new Error("Invalid duration value provided");
  }

  if (!fareRates.hasOwnProperty(vehicleType)) {
    throw new Error(`Invalid vehicle type: ${vehicleType}`);
  }

  const rates = fareRates[vehicleType];

  const totalFare =
    rates.baseFare +
    distance * rates.perKmRate + // distance already in km
    duration * rates.perMinuteRate;

  return Math.round(totalFare); // Round to nearest integer
};

export default fareCalculator;
