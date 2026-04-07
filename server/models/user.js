    import mongoose from "mongoose";
    import bcrypt  from 'bcryptjs';


    const adjustmentHistorySchema = new mongoose.Schema({
        change:{
            type: Number,
            required: true
        },
        currentNTRP:{
            type: Number,
            //required: true
        },
        previousNTRP:{
            type: Number,
        },
        reason:{
            type: String,
            default: 'Social-vote'
        },
        at:{
            type: Date,
            default: Date.now
        }
    }, {_id: false})

    const noteHistorySchema = new mongoose.Schema({
        note: {
            type: String,
            trim: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        at: {
            type: Date,
            default: Date.now
        }
    }, {_id: true})

    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        lastname: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            //required: true,
            trim: true,
            select: false
        },
        provider:{
            type: String,
            enum: ["local", "google"],
            default: "local"
        },
        firebaseUid: String,
        phone: {
            type: String,
            //required: true,
            trim: true
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "user", "booker"],
            default: "user"
        },
        ntrplvl: {
            type: Number,
            //required: true,
            min: 1,
            max: 7
        },
        adjustmentHistory:{
            type: [adjustmentHistorySchema],
            default: []
        },
        gender: {
            type: String,
            //required: true,
            enum: ["male", "female", "other"]
        },
        country: {
            type: String,
            //required: false
        },
        isActive:{
            type: Boolean,
            default: true
        },
        resetPasswordToken: {
            type: String,
            default: null,
            select: false
        },
        resetPasswordExpire:{
            type: String,
            default: null,
            select: false
        },
        profilePicture:{
            type:{
                url: String,
                public_id: String
            },
            default: null
        },
        termsAndConditions: {
            type: Boolean,
            default: false
        },
        isFirstLogin: {
            type: Boolean,
            default: true
        },
        loginAttempts:{
            type: Number,
            default: 0
        },
        lockUntil:{
            type: Date,
            default: null,
        },
        notesHistory: {
            type: [noteHistorySchema],
            default: []
        },
        receivesPayment: {
            type: Boolean,
            default: false
        },
        walletBalance:{
            type: Number,
            default: 0
        }
    }, {
        timestamps: true
    });


    //pass encrypt
    userSchema.pre("save", async function(next){
        if(!this.isModified("password") || !this.password) return;
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    });

    //comparar pass para el login
    userSchema.methods.comparePassword = async function(password){
        return bcrypt.compare(password, this.password)
    }

    export default mongoose.model("User", userSchema);
