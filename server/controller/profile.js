import cloudinary from "../config/cloudinary.js";
import {
    getResend
} from "../config/resend.js";
import { generateDeleteAccountToken, hashDeleteAccountToken } from "../helpers/accountDeletion.js";
import User from "../models/user.js";
import crypto from 'crypto'
import bcrypt from "bcryptjs";
import {fileTypeFromBuffer} from 'file-type'
import sharp from 'sharp';
import { sendDeletAccountEmail } from "../utils/emailService.js";

export const viewProfile = async (req, res) => {
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

export const updateProfile = async (req, res) => {
    try {

        const userID = req.user._id

        const {
            name,
            lastname,
            phone,
            gender,
        } = req.body;

        const user = await User.findById(userID)

        if (!user || !user.isActive) {
            return res.status(400).json({
                ok: false,
                message: 'User not found or unavailable'
            })
        }

        if (name !== undefined) user.name = name;
        if (lastname !== undefined) user.lastname = lastname;
        if (phone !== undefined) user.phone = phone;
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

export const resetPasswordEmail = async (req, res) => {
    try {

        const {
            email
        } = req.body;

        const resend = getResend()

        if (!email) return res.status(400).json({
            ok: false,
            message: 'Email is required'
        });

        const user = await User.findOne({
            email
        });



        if (!user || user.provider !== 'local') return res.status(200).json({
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


export const resetPassword = async (req, res) => {
    try {
        const {
            token
        } = req.params;

        const {
            newPassword
        } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Token and password required'
            })
        }


        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        }).select('+password');



        if (!user) return res.status(400).json({
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

export const uploadProfilePicture = async (req, res) => {     


    try {
        if (!req.file) return res.status(400).json({
            ok: false,
            messge: 'No file uploaded'
        });

        const fileType = await fileTypeFromBuffer(req.file.buffer);

        if(!fileType || !['image/jpeg', 'image/png', 'image/webp'].includes(fileType.mime)){
            return res.status(400).json({
                ok: false,
                messge: 'Only jpeg, png and webp formats allowed'
            });  
        }

        const user = await User.findById(req.user._id).select('profilePicture')

        if(!user){
            return res.status(400).json({
                ok: false,
                messge: 'User not found'
            });
        }


        //sanitize image
        const processedImage = await sharp(req.file.buffer)
                                .rotate()
                                .resize(400, 400, {
                                    fit: "cover",
                                    position: 'centre'
                                })
                                .webp({quality: 90})
                                .toBuffer()
            
        
    
        if(user.profilePicture?.public_id){
            await cloudinary.uploader.destroy(user?.profilePicture.public_id)
        }

        // cloduinary upload
        const result = await cloudinary.uploader.upload_stream(
            {
                folder: "weekly_tennis_profiles",
                resource_type: "image",
                format: "webp"
            },
            async(error, result) =>{
                if(error){
                    return res.status(400).json({
                        ok: false,
                        messge: 'Upload failed'
                    });
                }

                user.profilePicture = {
                    url: result.secure_url,
                    public_id: result.public_id
                }

                await user.save();

                return res.status(200).json({
                    messge: 'Profile picture uploaded',
                    profilePicture: user?.profilePicture
                });
            }
        );

        result.end(processedImage)   

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            messge: 'Internal error uploading profile picture'
        })
    }
}

export const getTotalFunds = async(req, res) =>{
    try {
        const userId = req.user._id

        const walletBalance = await User.findById(userId).select("walletBalance")

        return res.status(200).json(walletBalance)

    } catch (error) {
        console.log(error)
        return res.status(400).json({
                ok: false,
                message: 'Internal error refunding/adjusting user'
        })
    }
}

export const closeAccount = async(req, res) =>{
    try {
        const userId = req.user._id

        const user = await User.findById(userId);

         if(!user || !user.isActive) return res.status(400).json({
            ok: false,
            message: 'User account not found or is already closed'
        });  

        user.isActive = false
        user.notesHistory.push({
            note: `Account closed by user`,
            createdBy: req.user._id
        });

        await user.save()

        return res.status(200).json({
            ok: true,
            message: 'Your account has been closed'
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
                ok: false,
                message: 'Internal server error closing account'
        })
    }
}

export const deleteAccountRequest = async(req, res) =>{
    try {

        const userId = req.user._id

         const user = await User.findById(userId).select('+lastDeleteAccountRequestedAt');

         if(!user || !user.isActive || user.isDeleted) return res.status(400).json({
            ok: false,
            message: 'User account not found or is already closed'
        });  

        //cooldown request 
        if (user.lastDeleteAccountRequestedAt && (Date.now() - user.lastDeleteAccountRequestedAt.getTime()) < 60 * 1000){
            return res.status(429).json({
                ok: false,
                message: 'Please wait a moment before requesting this action again'
            });
        }

        const rawToken = generateDeleteAccountToken();

        user.deleteAccountTokenHash = hashDeleteAccountToken(rawToken)
        user.deleteAccountTokenExpire = new Date(Date.now() + 15 * 60 * 1000)
        user.lastDeleteAccountRequestedAt = new Date();

        await user.save();

        const confirmUrl = `${process.env.FRONTEND_URL}/account/delete/${rawToken}`

        sendDeletAccountEmail(user.email, user.name, confirmUrl)
                .catch((err) => console.log(err))

        return res.status(200).json({
            ok: true,
            message: 'Confirmation link sent. It will expire in 15 minutes'
        })
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
                ok: false,
                message: 'Internal server error closing account'
        })
    }
}

export const confirmAccountDelete = async(req, res) =>{
    try {

        const userId = req.user._id
        const {token} = req.body;

        if(!token || typeof token !== 'string'){
            return res.status(400).json({
                ok: false,
                message: 'Account token required'
            })
        }

        const hashedToken = hashDeleteAccountToken(token)

        const user = await User.findOne({
            _id: userId,
            deleteAccountTokenHash: hashedToken,
            deleteAccountTokenExpire: { $gt: Date.now() }
        }).select('+deleteAccountTokenHash +deleteAccountTokenExpire +password');


        if(!user){
            return res.status(400).json({
                ok: false,
                message: 'Invalid or expired token'
            })
        }

        const anonymizedEmail = `$deleted-${user._id}@deleted.mtc.app`
        const randomPassword = crypto.randomBytes(32).toString("hex");
        
        user.name = 'Deleted'
        user.lastname = 'user'
        user.email = anonymizedEmail
        user.password = await bcrypt.hash(randomPassword, 12)
        user.phone = undefined
        user.gender = undefined
        user.country = undefined
        user.profilePicture = null
        user.provider = 'local'
        user.firebaseUid = undefined
        user.fcmToken = undefined
        user.lastMatchPlayed = null
        user.resetPasswordToken = null
        user.sessions = []
        user.resetPasswordExpire = null
        user.verificationCodeHash = null
        user.verificationCodeExpires = null
        user.deleteAccountTokenHash = null
        user.isActive = false
        user.isDeleted = true
        user.deletedAt = new Date();
        
        user.notesHistory.push({
            note: 'Account permanently deleted by user (GDPR erasure request)',
            createdBy: user._id
        })

        await user.save();

        res.clearCookie('refreshToken', {path: '/api/user'})

        res.status(200).json({
            ok: true,
            message: 'Your account has been permanently deleted'
        })
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
                ok: false,
                message: 'Internal server error closing account'
        })
    }
}