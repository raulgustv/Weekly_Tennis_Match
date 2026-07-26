import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
}, {_id: false});

const generatedMatchSchema = new mongoose.Schema({
    round:{
        type: Number,
        required: true
    },
    court: {
        type: Number,
        required: true
    },
    teamA: {
        player1:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        player2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true 
        }
    },
    teamB:  {
        player1:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        player2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true 
        }
    },
    averageNTRPA: {
        type: Number,
    },
    averageNTRPB: {
        type: Number
    },
    hasBye: {
        type: Boolean,
        default: false
    }, 
    byePlayer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {_id: false})

const matchCourtSchema = new mongoose.Schema({
    courtNumber: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {_id: false})

const matchSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    courts:{
        type: [matchCourtSchema],
        required: true
    },
    maxPlayers: {
        type: Number,
        required: true
    },
    maxBackups:{
        type: Number,
        required: true,
        default: 4
    },
    players:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {type: Date, default: Date.now},
        payment:{
            method: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ['unpaid', 'paid', 'booker'],
                default: 'unpaid'
            },
            amount: {
                type: Number
            },
            confirmedAt: Date,
            confirmedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    }],
    backUps:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {type: Date, default: Date.now},
        status:{
            type: String,
            enum: ['waiting', 'invited', 'accepted', 'rejected', 'expired'],
            default: 'waiting'
        },
        invitedAt: Date

    }],
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },  
    paymentMethods:{
        type: [paymentMethodSchema],
        required: 'true'
    },
    status:{
        type: String,
        enum: ['Open', 'Full', 'Ready', 'Playing', 'Played', 'Cancelled', 'Closed',],
        default: "Open"
    },
    wasPlayed: {
        type: Boolean,
        default: false
    },
    generatedMatches: [generatedMatchSchema]
}, {timestamps: true});

export default mongoose.model('Match', matchSchema);