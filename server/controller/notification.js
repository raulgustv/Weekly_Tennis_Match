import admin from "../config/firebase.js"
import User from "../models/user.js";


export const saveFCMToken = async(req, res) =>{

    try {
        await User.findByIdAndUpdate(req.user._id, {
            fcmToken: req.body.token
        }) ;

        return res.status(200).json({
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error obtaining message token'
        })
    }
}