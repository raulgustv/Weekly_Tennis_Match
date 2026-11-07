import mongoose from "mongoose";

// CHANGE (NUEVO): lista cerrada de motivos, tomada del Reglamento ("Penalty system").
// Los validators del paso 2 importarán esta misma lista para no duplicarla.
export const PENALTY_CATEGORIES = [
    'no_show',
    'late_cancellation',
    'rejecting_challenge',
    'avoided_result_reporting',
    'verbal_abuse',
    'aggressive_behaviour',
    'cheating',
    'other'
];

// CHANGE (NUEVO): los puntos caducan a los 6 meses (Reglamento).
// Se calcula una sola vez al crear el registro.
const sixMonthsFromNow = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    return date;
};

// CHANGE (NUEVO): historial de penalizaciones. Cada documento = 1 punto.
// `Ranking.penaltyPoints` seguirá siendo el contador rápido; esta colección es
// la fuente de verdad (quién, cuándo, por qué, quién lo revocó) y permite la
// caducidad de 6 meses sin perder auditoría.
const rankingPenaltySchema = new mongoose.Schema({
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
    ranking: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ranking',
        required: true
    },
    category: {
        type: String,
        enum: PENALTY_CATEGORIES,
        required: true
    },
    note: {
        type: String,
        trim: true,
        maxlength: 500,
        required: true
    },
    // 'system' reservado para las penalizaciones automáticas de closeRound
    // (hoy no crean registro; se puede conectar más adelante).
    source: {
        type: String,
        enum: ['admin', 'system'],
        default: 'admin'
    },
    issuedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    },
    expiresAt: {
        type: Date,
        default: sixMonthsFromNow
    },
    // Revocación por un admin (el registro NO se borra, para conservar la auditoría)
    revokedAt: {
        type: Date,
        default: null
    },
    revokedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    },
    revokeNote: {
        type: String,
        trim: true,
        maxlength: 500,
        default: null
    }
}, { timestamps: true });

rankingPenaltySchema.index({ season: 1, userId: 1, createdAt: -1 });
// Para el job diario de caducidad (paso posterior)
rankingPenaltySchema.index({ expiresAt: 1 });

export default mongoose.model('RankingPenalty', rankingPenaltySchema);