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

    body("courtNumbers")
    .isArray().withMessage("Court number(s) required")
    .isInt({min: 1}).withMessage("Court number(s) must be a positive integer number"),

    body("paymentMethods")
    .isArray().withMessage("Payment methods must be an array")
    .notEmpty().withMessage("Payment methods required")   
    
]