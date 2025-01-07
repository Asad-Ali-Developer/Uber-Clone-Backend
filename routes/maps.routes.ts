import express from "express";
const router = express.Router();
import { authUserMiddleware } from "../middlewares";
import mapController from "../controllers/map.controller";
import {
  mapDistanceTimeValidation,
  mapQueryValidaiton,
  mapAddressingSuggestionsValidation,
} from "../validations";

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
