// import { getTravelDetailsOSRM } from "../controllers";

// type FareRates = {
//   [vehicleType: string]: {
//     baseFare: number;
//     perKmRate: number;
//     perMinuteRate: number;
//   };
// };

// // Fare rates for different vehicle types
// const fareRates: FareRates = {
//   car: {
//     baseFare: 100, // Base fare in your currency
//     perKmRate: 10, // Per kilometer rate
//     perMinuteRate: 2, // Per minute rate
//   },
//   bike: {
//     baseFare: 50,
//     perKmRate: 15,
//     perMinuteRate: 3,
//   },
//   auto: {
//     baseFare: 40,
//     perKmRate: 5,
//     perMinuteRate: 1,
//   },
// };

// const fareCalculator = async (
//     origin: { lat: number; lon: number },
//     destination: { lat: number; lon: number },
//     vehicleType: string
// ) => {


//   // Ensure vehicleType exists in fareRates
//   if (!fareRates[vehicleType]) {
//     throw new Error(`Invalid vehicle type: ${vehicleType}`);
//   }

//    // profile: "driving" | "walking" | "cycling" = "cycling"
//    const { distance, duration } = await getTravelDetailsOSRM(
//     origin,
//     destination,
//     vehicleType as string
//   );

//   const rates = fareRates[vehicleType];

//   // Calculate total fare
//   const totalFare =
//     rates.baseFare + distance * rates.perKmRate + time * rates.perMinuteRate;

//   return Math.round(totalFare); // Return rounded fare
// };

// export default fareCalculator;
