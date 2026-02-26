import {
    body
} from 'express-validator';

export const registerValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({min: 2, max: 50}).withMessage("Name must have between 2 and 50 characters")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage("Name contains invalid characters"),

    body("lastname")
    .notEmpty().withMessage("Lastname is required")
    .isLength({min: 2, max: 50}).withMessage("Lastname must have between 2 and 50 characters")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage("Lastname contains invalid characters"),

    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({
        min: 6,
        max: 80
    }).withMessage("Password length must be between 6 and 80 characters"),
    //.matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    //.matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    //.matches(/[0-9]/).withMessage("Password must contain at least one number"),


    body("phone")
    .trim()
    .notEmpty().withMessage("Phone is required")
    .isLength({
        min: 6,
        max: 20
    }).withMessage("Invalid phone number"),

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