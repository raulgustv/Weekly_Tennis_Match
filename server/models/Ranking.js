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
    // CHANGE (CRÍTICO): antes `pentaltyPoints` → closeRound hace $inc: {penaltyPoints} y Mongoose lo descartaba: las penalizaciones nunca se guardaban.
    penaltyPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'retired'],
        default: 'active'
    },
    dateOfLeave:{
        type: Date,
        default: null
    },
    //suspension system
    // CHANGE (CRÍTICO): antes `supsendedUntilRound` → la propuesta de ronda filtra por `suspendedUntilRound`.
    suspendedUntilRound:{
        type: Number,
        default: null
    },
    lastRoundPlayed: {
        type: Number,
        default: 0
    }
}, {timestamps: true})  

rankingSchema.index({season: 1, userId: 1}, {unique: true});
// CHANGE: antes index({season: 1}, {rating: -1}) — el 2º argumento son opciones, no campos.
rankingSchema.index({season: 1, rating: -1})

export default mongoose.model('Ranking', rankingSchema);