import mongoose from "mongoose";

const setScoreSchema = new mongoose.Schema({
    gamesA: {
        type: Number,
        required: true,
        min: 0,
        max: 7
    },
    gamesB: {
        type: Number,
        required: true,
        min: 0,
        max: 7
    },
}, {_id: false})

const penaltyIssueSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        enum: [
            'no_show',
            'late_cancellation',
            'rejected_challenge',
            'avoided_result_reporting',
            'verbal_abuse',
            'unsporting_conduct',
            'cheating',
            'other'
        ],
        required: true
    },
    points: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}, {_id: false})

const rankingMatchSchema = new mongoose.Schema({
    season: {
        type: mongoose.Schema.ObjectId,
        ref: 'Season',
        required: true
    },
    round: {
        type: Number,
        required: true,
        min: 1
    }, 
    playerA: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    playerB: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    //best of two sets y super tie
    sets: {
        type: [setScoreSchema],
        default: []
    },
    superTieBreak: {
        played: {type: Boolean, default: false},
        pointsA: {type: Number, default: null},
        pointsB: {type: Number, default: null},
    },
    winner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: [
            'scheduled',      // ronda generada, partido aún no jugado
            'played',         // resultado enviado y confirmado
            'walkover',       // un jugador no se presentó / se retiró
            'disputed',       // resultados en conflicto o ausentes, pendiente de admin
            'admin_resolved', // Reglamento: "el resultado de la administración no se puede disputar"
            'cancelled'
        ],
        default: 'scheduled'
    },
    //cron admin confirms to publish new round 
    published: {
        type: Boolean,
        default: false
    },
    confirmedBy: {
        type: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
        default: []
    },
    resultSource: {
        type: String,
        enum: ['Player', 'Admin'],
        default: 'Player'
    },
    resolvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    },
    noShowBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    },
    ratingBefore: {
        playerA: {type: Number, default: null},
        playerB: {type: Number, default: null}
    },
    ratingDelta:{
        playerA: {type: Number, default: null},
        playerB: {type: Number, default: null}
    },
    marginMultiplier:{
        type: Number,
        default: null
    },
    penaltiesIssued:{
        type: [penaltyIssueSchema],
        default: []
    },
    scheduledFor:{
        type: Date,
        default: null
    },
    playedAt:{
        type: Date,
        default: null
    },
    notes:{
        type: String,
        trim: true,
        maxLength: 500
    },
}, {timestamps: true})

rankingMatchSchema.index({season: 1, round: 1})
rankingMatchSchema.index({playerA: 1, playerB: 1, season: 1})
rankingMatchSchema.index({status: 1})

export default mongoose.model('RankingMatch', rankingMatchSchema);
