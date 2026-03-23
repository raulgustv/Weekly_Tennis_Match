import {body} from 'express-validator';

export const createMatchValidator = [
    body('locationSlug')
    .notEmpty().withMessage("Location slug required"),

    body('date')
    .notEmpty().withMessage("Location slug required")
    .isISO8601().withMessage("Valid date required")
    .custom((v) =>{
        const inputDate = new Date(v);
        const today = new Date();

        //remove hours
        inputDate.setHours(0,0,0,0)
        today.setHours(0,0,0,0)

        if(inputDate < today) throw new Error('Date must be on a future date')

        return true
    }),

    body('startTime')
    .notEmpty().withMessage("Location slug required")
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('startTime must be HH:mm'),

    body('endTime')
    .notEmpty().withMessage("Location slug required")
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('startTime must be HH:mm'),

    body("courts")
    .isArray({min: 1}).withMessage("At least one court is required"),

    body("courts.*.courtNumber")
    .isInt({min: 1}).withMessage("Court number must be a positive integer number"),

    body("courts.*.price")
    .isFloat({min: 0}).withMessage("Price must be a positive integer number"),

    body("paymentMethods")
    .isArray({min: 1}).withMessage("Payment methods must be an array")
    .notEmpty().withMessage("Payment methods required")      
]