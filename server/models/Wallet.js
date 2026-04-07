import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type:{
        type: String,
        enum: ['deposit', 'refund', 'adjustment', 'match_payment'],
        required: true,
        default: 'deposit'
    },
    status:{
        type: String,
        enum: ["pending", "confirmed", "rejected"],
        default: "pending",
        index: true
    },
    method: {
        type: String,
        enum: ["bizum", "revolut", 'paypal', "cash"],
        required: function (){
            return this.type === "deposit"
        }
    },
    assignedAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    note: {
        type: String,
        trim: true,
    }
}, {timestamps: true});

export default mongoose.model("WalletTransaction", walletTransactionSchema);

