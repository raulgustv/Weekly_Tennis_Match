import jwt from 'jsonwebtoken';
import User from "../models/user.js";

export const protect = async(req, res, next) =>{
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) return res.status(401).json({
            ok: false,
            message: 'Auth token not provided'
        });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Internal error validating token', error
        })
    }
}

export const verifyAdmin = async(req, res, next) =>{
    if(req.user.role !== 'admin'){
        return res.status(403).json({
            ok: false,
            message: 'Only admin can access this resource'
        })
    }
    next();
}