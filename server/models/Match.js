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
        invitedAt: Date,
        // CAMBIO (nuevo): el backup elige método de pago al apuntarse (igual
        // que un player), para poder auto-promocionarlo con ese método si un
        // jugador deja la partida — sin esto, promover un backup a player
        // rompía la validación (players.payment.method es required y los
        // backups no tenían payment). NO se marca `required: true` aquí a
        // propósito: hay backups ya en Mongo de antes de este cambio, sin
        // este campo, y si Mongoose lo exigiera se rompería el guardado de
        // esos documentos antiguos en cuanto se tocase el match por
        // cualquier otro motivo. La obligatoriedad de elegir método se
        // valida en el controlador (joinMatch), no aquí.
        payment: {
            method: {
                type: String
            },
            // 'held': se reservó el importe de su wallet al apuntarse como
            // backup (se libera/gasta al promocionarlo, se reembolsa si
            // sale sin llegar a jugar). 'unpaid': eligió un método que no
            // es wallet, no hay dinero movido todavía.
            status: {
                type: String,
                enum: ['unpaid', 'held'],
                default: 'unpaid'
            },
            amount: {
                type: Number
            }
        }
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
    generatedMatches: [generatedMatchSchema],
    // CAMBIO (nuevo): dos campos para poder avisar por push "Matches have been
    // generated" 10 minutos después de generar/editar los partidos, sin volver a
    // avisar si se sigue editando dentro de esos 10 minutos.
    // - generatedMatchesUpdatedAt: se pone a "ahora" cada vez que se generan o se
    //   editan los partidos (generateMatches / updateGeneratedMatches en
    //   controller/match.js). Es lo que reinicia la cuenta atrás de 10 minutos.
    // - generatedMatchesNotifiedAt: se pone a "ahora" cuando el cron
    //   (jobs/matchNotifications.js) ya ha enviado el aviso para la versión
    //   actual de generatedMatchesUpdatedAt, para no enviarlo dos veces.
    generatedMatchesUpdatedAt: {
        type: Date,
        default: null
    },
    generatedMatchesNotifiedAt: {
        type: Date,
        default: null
    }
}, {timestamps: true});

matchSchema.index({ status: 1, date: 1 });
matchSchema.index({ createdBy: 1 });
matchSchema.index({ "players.user": 1 });

export default mongoose.model('Match', matchSchema);