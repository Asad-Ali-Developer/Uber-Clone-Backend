import { Router } from "express";
import mapController from "../controllers/map.controller";
import { authUserMiddleware } from "../middlewares";
import {
  mapAddressingSuggestionsValidation,
  mapDistanceTimeValidation,
  mapQueryValidaiton,
} from "../validations";

const router: Router = Router();

const { getAddressCoordinate, getDistanceAndTime, getAddressSuggestions } =
  mapController;

// Route to fetch coordinates
router.get(
  "/get-coordinates",
  mapQueryValidaiton,
  authUserMiddleware,
  getAddressCoordinate
);

router.get(
  "/get-distance-time",
  mapDistanceTimeValidation,
  authUserMiddleware,
  getDistanceAndTime
);

router.get(
  "/get-address-suggestions",
  mapAddressingSuggestionsValidation,
  authUserMiddleware,
  getAddressSuggestions
);

export default router;
