import {body} from 'express-validator';

export const addFundsValidator = [
    body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({gt: 0}).withMessage('Amount must be higher than 0')
    .isFloat({max: 200}).withMessage('Amount cannot exceed 200€'),

    body('method')
    .notEmpty().withMessage('Method is required')
    .isIn(["bizum", "revolut", "cash"]).withMessage('Invalid payment method')
]