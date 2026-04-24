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

        req.user = await User.findById(decoded.id)
                                .select("name lastname email role isActive ntrplvl adjustmentHistory profilePicture country walletBalance")
        if(!req.user) return res.status(401).json({
            ok: false,
            message: "User no longer exists"
        })

        next();


    } catch (error) {
        //console.log(error)
        res.status(401).json({
            ok: false,
            message: 'Invalid or expired token'
        })
    }
}

export const verifyAdmin = async(req, res, next) =>{
   
    try {

        const user = await User.findById(req.user._id).select("role");

        if(user.role !== 'admin'){
            return res.status(403).json({
                ok: false,
                message: 'Only admin can access this resource'
            })
        }
        next();
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
                ok: false,
                message: 'Internal error verifying admin credentials'
            })
    }
   
}

export const verifyBookerOrAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("role");

        if (!user || (user.role !== "admin" && user.role !== "booker")) {
            return res.status(403).json({
                ok: false,
                message: "Only admin or booker can access this resource"
            });
        }

        next(); 

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Error verifying role"
        });
    }
};