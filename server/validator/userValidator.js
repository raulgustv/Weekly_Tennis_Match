import {
    body
} from 'express-validator';

export const registerValidator = [
    body("name")
    .notEmpty().withMessage("Name is required"),
    body("lastname")
    .notEmpty().withMessage("Lastname is required"),
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({
        min: 6,
        max: 80
    }).withMessage("Password length must be between 6 and 80 characters"),
    body("phone")
    .notEmpty().withMessage("Phone is required"),
    body("ntrplvl")
    .notEmpty().withMessage("NTRP level is required")
    .custom(value => {
        const levels = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, ];
        if (!levels.includes(Number(value))) {
            throw new Error("Invalid NTRP level")
        }
        return true
    }),
    
    body("gender")
    .notEmpty().withMessage("Gender is required")
    .isIn(["male", "female", "other"]).withMessage("Gender must be male, female or other")
]

export const loginValidator = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    body("password")
    .notEmpty().withMessage("Password is required")
]

export  const googleValidator = [
    body("token")
    .notEmpty().withMessage("Token is required")
]