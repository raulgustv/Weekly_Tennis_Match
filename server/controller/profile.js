import { getResend } from "../config/resend.js";
import User from "../models/user.js";
import crypto from 'crypto'




export const viewProfile = async(req, res) =>{
    try {

        const userId = req.user._id;

        const userProfile = await User.findById(userId)

        return res.status(200).json(userProfile)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            error: 'Internal error fetching user'
        })
    }
}

export const updateProfile = async(req, res) =>{
    try {

        const userID = req.user._id

        const {
            name,
            lastname,
            phone,
            ntrplvl,
            gender,
        } = req.body;

        const user = await User.findById(userID)

        if(!user || !user.isActive){
            return res.status(400).json({
                ok: false,
                message: 'User not found or unavailable'
            })
        }

        if (name !== undefined) user.name = name;
        if (lastname !== undefined) user.lastname = lastname;
        if (phone !== undefined) user.phone = phone;
        if (ntrplvl !== undefined) user.ntrplvl = ntrplvl;
        if (gender !== undefined) user.gender = gender;

        await user.save();

        return res.status(200).json(user)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            error: 'Internal error updating user data'
        })
    }
}

export const resetPasswordEmail = async(req, res) =>{
    try {

       const {email} = req.body;

       const resend = getResend()

       if(!email) return res.status(400).json({
            ok: false,
            message: 'Email is required'
       });

       const user = await User.findOne({email});
       

       if(!user || user.provider !== 'local') return res.status(200).json({
            ok: true,
            message: 'Reset link has been sent to your email'
       });

       //token raw
       const resetToken = crypto.randomBytes(32).toString('hex');

       //hashed token
       const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

       user.resetPasswordToken = hashedToken;
       user.resetPasswordExpire = Date.now() + 1000 * 60 * 15 //15 min

       await user.save();

       const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;
       
       await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'MTC Reset password',
            html: `
                <h2>Password reset</h2>
                <p>This link will expire in 15 minutes</p>
                <a href="${resetURL}">Reset password</a>
            `
       });

       res.status(200).json({
        message: `Link sent to ${user.email}`
       })



        
    } catch (error) {
         console.log(error)
        res.status(500).json({
            ok: false,
            error: 'Cannot change password due to server error'
        })
    }
}


export const resetPassword = async(req, res) =>{
    try {
        const {token} = req.params;

        const {newPassword} = req.body;

        if(!token ||  !newPassword){
            return res.status(400).json({
                ok: false,
                message: 'Token and password required'
            })
        }      


        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');        

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {$gt: Date.now()}
        }).select('+password');



        if(!user) return res.status(400).json({
                ok: false,
                message: 'Token is invalid or expired'
            })

        user.password = newPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: 'Password successfully reset'
        })
        
    } catch (error) {
         console.log(error)
         return res.status(500).json({
            ok: false,
            error: 'Cannot change password due to server error'
        })
    }
}


