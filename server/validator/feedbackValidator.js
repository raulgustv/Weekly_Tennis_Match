import {body} from 'express-validator';

export const feedbackValidator = [

    body('rating')
    .notEmpty().withMessage("A rating is required")
    .isInt({min: 1, max: 5}).withMessage("Rating must be a positive integer number, between 1 and 5"),

    body("comment")
    .optional()
    .isLength({max: 1000}).withMessage("Comment cannot exceed 1000 characters"),    

    body('category')
    .notEmpty().withMessage('Category is required')
    .isIn([
        "usability",
        "performance",
        "bugs",
        "features",
        "notifications",
        "design",
        "organization",
        "level_balance",
        "court",
        "players",
        "host",
        "overall_experience",
        "other",
    ]).withMessage('Invalid category')
   
]

export const eligibilityValidator = [
    body("triggerType")
    .notEmpty().withMessage('A trigger type is required')
    .isIn([
        'first_match',
            'usage_milestone',
            'after_mayor_update',
            'returning_user',
            'post_match',
            'user_initiated'
    ]).withMessage('Please use a valid trigger type'),

    body("type")
    .optional()
    .isIn(['app', 'match']).withMessage('Please use a valid type')
]