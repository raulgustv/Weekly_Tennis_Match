import {validationResult} from 'express-validator';
import mongoose from 'mongoose';

export const validateFields = (req, res, next) =>{
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json(errors.array())
    }
    next()
}


export const validateObjectId = (paramName) =>{
    return (req, res, next) =>{
        const value = req.params[paramName];

        if(!mongoose.Types.ObjectId.isValid(value)){
            return res.status(400).json({
                ok: false,
                message: `Invalid ${paramName}`
            })
        }

        next();
    }
}