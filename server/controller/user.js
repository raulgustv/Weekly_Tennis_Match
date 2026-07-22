//import admin from "../config/firebase.js";
import User from "../models/user.js";
import { sendResetPasswordEmail } from "../utils/emailService.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from 'crypto'

export const validateEmail = async(req, res) =>{
    try {

        const {email} = req.query;

        if(!email){
                return res.status(400).json({
                ok: false,
                message: "Please enter an email"
            })
        }

        const exists = await User.findOne({email});


        return res.status(200).json({
            ok: true,
            available: !exists
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: "Internal error on email validation"
        })
    }
}

export const register =  async(req, res) =>{
    try {


        const {name, lastname, email, password, phone, ntrplvl, gender, country, termsAndConditions} = req.body;

        //check if exists
        const exists = await User.findOne({email: req.body.email})

        if(exists){
            return res.status(409).json({message: 'Email already registered'})
        }

        if(!termsAndConditions) return res.status(400).json({
            ok: false,
            message: 'Terms and conditions have not been accepted'
        })

        const user = await User.create({
            name,
            lastname,
            email,
            password,
            phone,
            ntrplvl,
            gender,
            country,
            termsAndConditions
            
        });

        const userObj = user.toObject();

        delete userObj.resetPasswordToken;
        delete userObj.password;
        delete userObj.resetPasswordExpire;
        
        res.status(201).json({
            token: generateToken(user),
            user: userObj
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            error: 'Internal server error on registration', error
        })
    }
}

export const login = async(req, res) =>{

    try {
        
        const {email, password} = req.body;

        const user = await User.findOne({email}).select('+password -resetPasswordToken -resetPasswordExpire');    

        if(user?.isActive === false) return res.status(400).json({
            ok: false,
            message: 'This account is inactive'
        })


        if(user?.provider === 'google') return res.status(400).json({
            ok: false,
            message: "User registered with external provider (Google, Facebook, X)"
        })

        if(!user){
            return res.status(401).json({message: "Invalid credentials"})
        }  

        if(user.lockUntil || user.lockUntil > Date.now()){
            return res.status(401).json({
                ok: false,
                message: "Account is locked due to multiple login failed attempts"
            })
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){

            user.loginAttempts += 1;

            if(user.loginAttempts >= 5){
                user.lockUntil = Date.now() + (30*60*1000)
            }

            await user.save()

            return res.status(401).json({
                ok: false,
                message: "Invalid credentials"
            })
        }

        user.loginAttempts = 0;
        user.lockUntil = null;
        user.successfulLoginCount = (user.successfulLoginCount || 0) + 1;

        await user.save()
        
        user.password = undefined;      

        res.json({
            token: generateToken(user),
            user,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            error: 'Internal login server error'
        })
    }
}

// export const googleAuth = async(req, res) =>{
//     try {
        
//         const {token} = req.body;

//         if(!token) return res.status(400).json({
//             ok: false,
//             message: "Token missing"
//         })

//         const decoded = await admin.auth().verifyIdToken(token);

//         const {uid, email, name} = decoded;

//         let user = await User.findOne({email});

//         if(!user){
//                 const [first, ...last] = (name || "User").split(" ")

//                 user = await User.create({
//                     name: first,
//                     lastname: last.join(" "),
//                     email,
//                     provider: "google",
//                     firebaseUid: uid
//                 })
//         }

//         const isProfileComplete = !!user.phone && !!user.ntrplvl && !!user.phone && !!user.country

//             res.json({
//                 token: generateToken(user),
//                 user: {
//                     id: user._id,
//                     email: user.email,
//                     role: user.role,
//                     name: user.name,
//                     isProfileComplete
//                 }
//         })
        
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             ok: false,
//             error: 'Internal google registery server error'
//         })
//     }
// }

export const viewAllUsers = async(req, res) =>{
    try {
        const users = await User.find().select('-resetPasswordToken -resetPasswordExpire');
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            error: 'Internal error fetching users'
        })
    }
}

export const viewUser = async(req, res) =>{  
    try {
        const {id} =  req.params;

        const user = await User.findById(id)

        if(!user){
            return res.status(400).json({
                ok: false,
                message: 'User not found'
            })
        }

        return res.status(200).json(user)


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            error: 'Internal error fetching user'
        })
    }
}

export const resetPasswordEmail = async(req, res) =>{
    try {

        const email = req.body;

        const user = await User.findOne(email);

        console.log(user)

        if(!user || user.provider !== 'local'){
            return res.status(400).json({
                ok: false,
                message: "User not found or email provider is not local"
            });
        };

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        

        await sendResetPasswordEmail(user.email, resetUrl)

        res.status(200).json({
            message: 'Reset password email sent'
        })


        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal server error, cannot reset password'
        })
    }
}

export const resetPassword = async(req, res) =>{
    try {
        
        const password = req.body;

        if(!password){
            return res.status(400).json({
                ok: false,
                message: "Password is required"
            })
        }

        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {$gt: Date.now()}
        }).select('+password');

        if(!user){
            return res.status(400).json({
                ok: false,
                message: "Invalid or expired token"
            })
        }

        //new pass
        user.password = password;

        //clean tokens 
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: "Internal error reseting password"
        })
    }
}


export const completeProfile = async (req, res) => {
  try {

    const { phone, gender, ntrplvl, country } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { phone, gender, ntrplvl, country },
        { new: true }
    );

    res.status(200).json(user)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        ok: false,
        message: 'Internal error completing profile'
    })
  }
};

export const completeOnboarding = async(req, res) =>{
    try {

        const userId = req.user._id

        const user = await User.findByIdAndUpdate(
            userId,
            {isFirstLogin: false},
            {new: true}            
        ).select("-password");

        if(!user) return res.status(500).json({
            ok: false,
            message: "User not found"
        })

        return res.status(200).json({
            message: "Onboarding complete",
            isFirstLogin: user.isFirstLogin
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: "Internal error completing onboarding"
        })
    }
}

export const getMeAuth = async(req, res) =>{
    try {
        const user = req.user;

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: "Server error obtaining user"
        })
    }
}

export const adminNote = async(req, res) =>{
    const {id} = req.params;
    const {note} = req.body;
    const {role} = req.user;

    try {

        if(role !== 'admin') return res.satus(404).json({
            oK: false,
            message: 'You are not authorized to access this resource'
        });

        const user = await User.findById(id);

        if(!user) return res.status(400).json({
            ok: false,
            message: 'User not found'
        })

        user.notesHistory.push({
            note,
            createdBy: req.user._id
        });

        await user.save();

        res.status(200).json({
            message: "Note added successfully",
            notesHistory: user.notesHistory
        })

        
    } catch (error) {
        return res.satus(404).json({
            oK: false,
            message: 'Internal error adding note'
        })
    }
}

export const userNotes = async(req, res) =>{
    try {

        const {id} = req.params;

        const userNotes = await User.findById(id).select('notesHistory').populate('notesHistory.createdBy', 'name lastname')

        if(!userNotes){
                res.status(400).json({
                ok: false,
                message: 'User notes not found'
            })
        }
        res.status(200).json(userNotes)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Server error obtaining notes'
        })
    }
}



export const suspendUser = async(req, res) =>{
    try {

        const {id} = req.params;

        const {note, days = 7} = req.body;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                ok: false,
                message: "User not found"
            })
        }

        user.suspendedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

        user.suspendedBy = req.user._id;

        user.notesHistory.push({
            note,
            createdBy: req.user._id
        });

        await user.save();

        return res.status(200).json({
            ok: true,
            message: `User suspended for ${days} day(s).`,
            suspendedUntil: user.suspendedUntil
        })

        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Unable to suspend user'
        })
    }
}







