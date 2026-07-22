import {body} from 'express-validator';

export const feedbackValidator = [

    body('rating')
    .isInt({min: 1, max: 5}).withMessage("Court number must be a positive integer number"),

    body("comment")
    .optional()
    .isLength({max: 1000}).withMessage("Comment cannot exceed 1000 characters"),    

    body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['match_organization',
                'match_balance',
                'scheduling',
                'skill_voting',
                'social_experience',
                'app_usability', 
                'performance', 
                'bug_report',
                'other']).withMessage('Invalid category')
   
]