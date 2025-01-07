// User Validations
import registerValidation from "./user/registerValidation";
import loginValidation from "./user/loginValidation";
import authenticateUser from "./user/userValidation";

// Captain Validations
import captainRegisterValidation from "./captain/captainRegisterValidation";
import loginCaptainValidation from "./captain/loginCaptainValidation";

// Map Validations
import mapQueryValidaiton from "./map/mapQueryValidaiton";
import mapDistanceTimeValidation from "./map/mapDistanceTimeValidation";
import mapAddressingSuggestionsValidation from "./map/maAddressingSuggestions.validation"

// Ride Validations
import createRideValidation from "./ride/createRide.validation"

export {
  registerValidation,
  loginValidation,
  authenticateUser,
  captainRegisterValidation,
  loginCaptainValidation,
  mapQueryValidaiton,
  mapDistanceTimeValidation,
  mapAddressingSuggestionsValidation,
  createRideValidation,
};
