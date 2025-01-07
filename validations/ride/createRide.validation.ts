import { body } from "express-validator";

const createRideValidation = [
    body('userId').isString().notEmpty().withMessage('userId is required'),
    body('origin').isString().notEmpty().withMessage('Origin is required'),
    body('destination').isString().notEmpty().withMessage('Destination is required'),
    body('rideType').isString().notEmpty().withMessage('Ride type is required'),
]

export default createRideValidation;