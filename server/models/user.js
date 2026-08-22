import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const adjustmentHistorySchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match"
    },
    change: {
        type: Number,
        required: true
    },
    currentNTRP: {
        type: Number,
    },
    previousNTRP: {
        type: Number,
    },
    reason: {
        type: String,
        default: 'Social-vote'
    },
    at: {
        type: Date,
        default: Date.now
    }
}, { _id: false })

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
}, { _id: true })

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
        trim: true,
        select: false
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    firebaseUid: String,
    phone: {
        type: String,
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
        min: 1,
        max: 5
    },
    adjustmentHistory: {
        type: [adjustmentHistorySchema],
        default: []
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    country: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: {
        type: String,
        default: null,
        select: false
    },
    resetPasswordExpire: {
        type: Date,          // ✅ antes era String
        default: null,
        select: false
    },
    profilePicture: {
        type: {
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
    loginAttempts: {
        type: Number,
        default: 0
    },
    successfulLoginCount: {
        type: Number,
        default: 0
    },
    eligibleFeedback: {
        type: Boolean,
        default: true
    },
    lockUntil: {
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
    walletBalance: {
        type: Number,
        default: 0
    },
    lastMatchPlayed: {
        type: Date,
        default: null
    },
    lastInactivityMailSentAt: {
        type: Date,
        default: null
    },
    suspendedUntil: {
        type: Date,
        default: null
    },
    suspendedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    nextAppFeedbakMilestone: {
        type: Number,
        default: 2
    },
    lastAppFeedback: {
        type: Date,
        default: null
    },
    fcmToken: {
        type: String,
        default: null
    },
    seenNotificationIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Notification",
        default: []
    },
    refreshTokenHash: {
        type: String,
        default: null,
        select: false
    },
    refreshTokenExpires: {
        type: Date,
        default: null,
        select: false
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    if (!this.password) {
        throw new Error("Password cannot be empty");
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    if (typeof password !== "string") {
        return false;
    }

    if (typeof this.password !== "string" || !this.password) {
        return false;
    }

    return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);