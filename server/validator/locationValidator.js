import {body} from 'express-validator';


export const newLocationValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("Court name required")
    .isLength({min: 5, max: 50}).withMessage("Court name must be between 5 and 50 characters"),

    body("address")
    .trim()
    .notEmpty().withMessage("Court address required")
    .isLength({min: 5, max: 2000}).withMessage("Court name must be between 5 and 500 characters"),

    body("courts")
    .isInt({min: 1, max: 29}).withMessage("There must be between 1 and 29  courts")
    .notEmpty().withMessage("Court total is required"),

    body("favorite")
    .optional()
    .isBoolean().withMessage("Favorite must be boolean value"),

    body("active")
    .optional()
    .isBoolean().withMessage("Active must be boolean value"),    

];

export const updateSurfaceValidator = [
    body("courtNumber")
    .isInt().withMessage("Court must be an integer")
    .notEmpty().withMessage("Court number required")
]