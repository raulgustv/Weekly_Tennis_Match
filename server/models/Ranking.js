import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
    season: {
        type: mongoose.Schema.ObjectId,
        ref: 'Season',
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rank: {
        type: Number,
        required: true,
        min: 1
    },
    rating: {
        type: Number,
        required: true,
        default: 1000
    },
    //auditoria reference
    //internal only
    seedNtrpLevel: {
        type: Number,
        default: null
    },
    pentaltyPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'retired'],
        default: 'active'
    },
    //suspension system
    supsendedUntilRound:{
        type: Number,
        default: null
    },
    lastRoundPlayed: {
        type: Number,
        default: 0
    }
}, {timestamps: true})  

//player cannot have two documents on the same ranking schema
rankingSchema.index({season: 1, userId: 1}, {unique: true});
rankingSchema.inde({season: 1}, {rating: -1})

export default mongoose.model('Ranking', rankingSchema);