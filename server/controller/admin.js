import mongoose from "mongoose";
import { adjustNTRPLevels } from "../jobs/adjustNTRP.js";
import Match from "../models/Match.js";
import User from "../models/user.js";
import WalletTransaction from '../models/Wallet.js'
import {
    promoteNextBackup,
    refundBackupWallet,
    notifyAutoPromoted,
    notifyRemovedByAdmin
} from "../utils/backups.js";
import { formatDate } from "../helpers/misc.js";

export const closeMatch = async(req, res) =>{
   try {
     const {id} = req.params;

    const match = await Match.findById(id);

    if(!match){
        return res.status(400).json({
            ok: false,
            message: "Match not found or does not exist"
        })
    }

    if(match.status !== "Played"){
        return res.status(400).json({
            ok: false,
            message: "Cannot close a match that has not been played"
        })
    }

    await adjustNTRPLevels(match?._id)

    match.status = "Closed";

    await match.save();

    res.status(200).json(match);
   } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error closing match'
        })
   }

}

export const adminAdjustNTRP = async(req,res) =>{
    try {
        const {userId} = req.params;
        const {newLevel} = req.body;

        const admin = req.user._id

        if(typeof newLevel !== "number"){
            return res.status(400).json({
                ok: false,
                message: "New NTRP level must be a number"
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                ok: false,
                message: "User not found"
            })
        };

        const oldLevel = user.ntrplvl;

        if(oldLevel === newLevel){
            return res.status(400).json({
                ok: false,
                message: "New level cannot be the same as te previous level"
            })
        }

        user.ntrplvl = Number(newLevel.toFixed(1));

        user.adjustmentHistory.push({
            change: Number((newLevel-oldLevel).toFixed(1)),
            currentNTRP: oldLevel,
            reason: 'Admin-adjustment'
        });

        if(user.adjustmentHistory.length > 20){
            user.adjustmentHistory.shift()
        }

        user.save();

        return res.status(200).json({
            message: 'Admin adjusted NTRP level',
            oldLevel, 
            newLevel: user.ntrplvl
        })


    } catch (error) {
         console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error adjusting NTRP for user'
        })
    }
}

export const togglePlayerActivation = async(req, res) =>{
    try {

        const {id} = req.params

        const user = await User.findById(id)

        if(!user) return res.status(400).json({
            ok: false,
            message: 'User not found'
        });    

        user.isActive = !user.isActive
         user.notesHistory.push({
            note: `Account ${!user.isActive ? 'closed by' : 'opened by'} admin`,
            createdBy: req.user._id
        });

        await user.save();

        return res.status(200).json({
            active: user.isActive,
            user
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error with user activation or de-activation'
        });

    }
}


export  const removePlayerMatch = async(req, res) =>{

    const session = await mongoose.startSession();

    let removedUserId = null;
    let promotedUserId = null;
    const { playerId, matchId } = req.params;

    try {

        await session.withTransaction(async () => {

        const user = await User.findById(playerId).session(session)
        const match = await Match.findById(matchId).session(session)

        if(!user || !match){
            throw new Error("User or match not found");
        }


        if(match.status !== 'Open' && match.status !== 'Full'){
           throw new Error("Cannot remove player from this match status");
        }

        const backupObj = match.backUps.find(p => p.user.toString() === playerId.toString())
        const isBackup = Boolean(backupObj);
        const isPlayer = match.players.some(p => p.user.toString() === playerId.toString())

        if(!isPlayer && !isBackup){
            throw new Error("Player not registered in this match");
        }

        // 🔵 NUEVO: registro en el historial de notas del usuario afectado,
        // igual que closeAccount/suspendUser. Se guarda dentro de la misma
        // transacción para que quede atado al resto de la operación.
        user.notesHistory.push({
            note: 'User removed from match 24 hours before match',
            createdBy: req.user._id
        });
        await user.save({ session });

        // 🔵 CAMBIO: antes solo hacía el filter/save, sin refund de wallet.
                if(isBackup){
            // CAMBIO (nuevo): antes de quitarlo, guardamos su payment —
            // hace falta para saber si hay que reembolsarle. Mismo patrón
            // que el refund de "removing as player" más abajo y que
            // leaveMatch en controller/match.js.
            const removedBackup = match.backUps.find(
                p => p.user.toString() === playerId.toString()
            );
            const removedBackupPaymentMethod = removedBackup?.payment?.method;
            const removedBackupPaymentStatus = removedBackup?.payment?.status;
            const removedBackupAmount = removedBackup?.payment?.amount;

            match.backUps = match.backUps.filter(p => p.user.toString() !== playerId.toString())
            await match.save({session})

            // CAMBIO (nuevo): si el backup tenía saldo de wallet retenido
            // (se retiene al apuntarse como backup con método "wallet", ver
            // joinMatch), se lo devolvemos al quitarlo — nunca llegó a
            // jugar, no hay motivo para quedarnos con ese dinero.
            if (removedBackupPaymentMethod === "wallet" && removedBackupPaymentStatus === "held") {
                await User.findByIdAndUpdate(
                    playerId,
                    { $inc: { walletBalance: removedBackupAmount } },
                    { session }
                );

                const formattedDate = new Date(match.date).toLocaleDateString("es-ES");

                await WalletTransaction.create(
                    [{
                        user: playerId,
                        amount: removedBackupAmount,
                        type: "refund",
                        status: "confirmed",
                        note: `Refund admin removed backup ${formattedDate}`,
                        match: match._id
                    }],
                    { session }
                );
            }

            return;
        }

        //removing as player
        const playerObj = match.players.find(p => p.user.toString() === playerId.toString());
        const paymentMethod = playerObj?.payment?.method;
        const paidAmount = match.price / match.maxPlayers;

        match.players = match.players.filter(p => p.user.toString() !== playerId.toString())

        // refund wallet hold, same as a self-initiated leave
        if(paymentMethod === "wallet"){
            await User.findByIdAndUpdate(
                playerId,
                { $inc: { walletBalance: paidAmount } },
                { session }
            );

            const formattedDate = new Date(match.date).toLocaleDateString("es-ES");

            await WalletTransaction.create([{
                user: playerId,
                amount: paidAmount,
                type: "refund",
                status: "confirmed",
                note: `Refund - removed by admin/booker from match ${formattedDate}`,
                match: match._id
            }], { session });
        }

        // 🔵 CAMBIO: antes -> const promotedUser = match.backUps.shift();
        // match.players.push(promotedUser) — metía el objeto de backup tal
        // cual en "players", con un payment que no cuadraba con el esquema.
        // Ahora usa el mismo helper que leaveMatch, que sí adapta el payment.
        const promoted = promoteNextBackup(match);

        if(match.players.length < match.maxPlayers){
            match.status = 'Open'
        }

        await match.save({session});

        removedUserId = playerId;
        promotedUserId = promoted?.userId || null;

        })

        // 🔵 CAMBIO: nuevo — antes no se avisaba a nadie al retirarlo.
        if (removedUserId) {
            notifyRemovedByAdmin(matchId, removedUserId).catch(console.error);
        }

        if (promotedUserId) {
            notifyAutoPromoted(matchId, promotedUserId).catch(console.error);
        }

        return res.status(200).json({
            message: "Removed player from match"
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            message: error.message || 'Error removing player from match'
        });
    }finally{
        session.endSession();
    }
}

export const toggleAdminRole = async(req, res) =>{
    const {id} = req.body;

    try {
        const user = await User.findById(id).select('name lastname role isActive')


        if(!user) return res.status(400).json({
            ok: false,
            message: 'User not found'
        });

        if(!user.isActive) return res.status(400).json({
            ok: false,
            message: 'User is inactive'
        });
        

        if(id === req.user._id.toString()) return res.status(400).json({
            ok: false,
            message: 'You cannot change you own status'
        });

        user.role = user.role === 'admin' ? 'user' : 'admin';

        await user.save();

        return res.status(200).json({
            message: 'User updated correctly',
            user
        });
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error updating user role'
        })
    }

    
}

/* ===================================================================== */
/* 🔵 CAMBIO (nuevo bloque): helpers y constantes compartidos por         */
/* togglePaymentStatus y updatePlayerPaymentMethod.                       */
/* ===================================================================== */

// 🔵 NUEVO: estados del partido en los que NO se permite tocar pagos.
// Solo "Closed": en el resto (Open, Full, Ready, Playing, Played, Cancelled)
// admin/booker pueden marcar pagos y cambiar el método.
const PAYMENT_LOCKED_STATUSES = ['Closed'];

// 🔵 NUEVO: estados en los que NO se puede cobrar con wallet. Coincide con la
// regla que ya se muestra al usuario en Wallet.jsx: "Wallet funds are intended
// for future matches only and cannot be used to pay for matches that have
// already been played". "Cancelled" también: no tiene sentido cobrar del
// wallet un partido que no se juega. Pasar DE wallet a otro método
// (reembolso) sí se permite en todos los estados no bloqueados.
const WALLET_CHARGE_BLOCKED_STATUSES = ['Played', 'Closed', 'Cancelled'];

// 🔵 NUEVO: error con código HTTP, para responder 400/404/409 con un mensaje
// controlado en vez de un 500 genérico (y sin filtrar errores internos).
const httpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

// 🔵 CAMBIO: togglePaymentStatus reescrito. Cambios respecto al original:
//  1. Devolvía 500 para errores de validación ("Match or user not provided",
//     "Player not found") -> ahora 400/404.
//  2. Bloquea partidos cerrados (Closed).
//  3. Bloquea el toggle si el método es "booker" o "wallet": el estado de un
//     pago wallet lo marca el movimiento real de saldo (se cobra al unirse).
//     Antes se podía poner un pago wallet en "unpaid" sin devolver el dinero,
//     dejando datos incoherentes. Para wallet, ahora se usa "cambiar método".
//  4. Update atómico condicionado al estado actual: si dos admins pulsan a la
//     vez, el segundo recibe 409 en vez de deshacer el cambio del primero.
//  5. Rellena confirmedAt / confirmedBy (ya existían en el esquema y nunca se
//     usaban) -> deja trazabilidad de quién confirmó el pago.
export const togglePaymentStatus = async(req, res) =>{
    const {matchId, userId} = req.params;

    try {

        const match = await Match.findOne(
            {_id: matchId, "players.user": userId},
            {'players.$': 1, date: 1, status: 1} // 🔵 CAMBIO: se añade status
        );

        if(!match || !match.players.length){
            throw httpError(404, 'Player not found for this match'); // 🔵 CAMBIO: era 500
        }

        // 🔵 NUEVO
        if (PAYMENT_LOCKED_STATUSES.includes(match.status)) {
            throw httpError(400, 'Payments cannot be edited for a closed match');
        }

        const player = match.players[0];
        const currentMethod = player.payment?.method;
        const currentStatus = player.payment?.status;

        // 🔵 NUEVO
        if (currentMethod === 'booker') {
            throw httpError(400, "The booker's payment cannot be changed");
        }

        // 🔵 NUEVO
        if (currentMethod === 'wallet') {
            throw httpError(400, 'Wallet payments are settled automatically. Change the payment method instead.');
        }

        const newStatus = currentStatus === "paid" ? "unpaid" : "paid";

        // 🔵 CAMBIO: update atómico condicionado al método y estado actuales
        // (antes solo filtraba por usuario) + confirmedAt / confirmedBy.
        const update = newStatus === 'paid'
            ? {
                $set: {
                    "players.$.payment.status": newStatus,
                    "players.$.payment.confirmedAt": new Date(),
                    "players.$.payment.confirmedBy": req.user._id
                }
            }
            : {
                $set: { "players.$.payment.status": newStatus },
                $unset: {
                    "players.$.payment.confirmedAt": "",
                    "players.$.payment.confirmedBy": ""
                }
            };

        const updatedMatch = await Match.findOneAndUpdate(
            {
                _id: matchId,
                players: {
                    $elemMatch: {
                        user: userId,
                        "payment.method": currentMethod,
                        "payment.status": currentStatus
                    }
                }
            },
            update,
            {new: true}
        );

        // 🔵 NUEVO
        if (!updatedMatch) {
            throw httpError(409, 'This payment was updated by someone else. Please refresh and try again.');
        }

        return res.status(200).json({
            message: "Payment status updated",
            updatedMatch
        })

    } catch (error) {
        console.log(error)
        // 🔵 CAMBIO: respeta el código del httpError; si es un error inesperado
        // responde 500 con mensaje genérico (no se expone error.message interno).
        return res.status(error.status || 500).json({
            ok: false,
            message: error.status ? error.message : 'Error updating payment status'
        })
    }
}

// 🔵 NUEVO (función completa): PUT /admin/payment-method/:matchId/:userId
// body: { method }
// Permite a admin/booker cambiar el método de pago de un JUGADOR (no backup),
// tanto antes como después del partido. Reglas:
//  - Solo métodos configurados en el propio partido (match.paymentMethods),
//    igual que valida joinMatch. "booker" nunca se puede asignar ni cambiar.
//  - DE wallet a otro método: se devuelve el importe al wallet del jugador
//    (WalletTransaction "refund") y el pago queda "unpaid" hasta que el
//    admin confirme el nuevo pago con el switch.
//  - DE otro método A wallet: se cobra del wallet (WalletTransaction
//    "match_payment") y queda "paid". Requiere walletPaymentAllowed del
//    creador del partido y saldo suficiente. Bloqueado en Played/Cancelled.
//  - Partidos "Closed": no se puede editar nada.
//  - Entre métodos que no son wallet (p.ej. bizum -> revolut): se mantiene
//    el estado paid/unpaid que ya tenía (es una corrección del método).
//  - Todo dentro de una transacción; el update del partido está condicionado
//    al método actual para evitar dobles cobros/reembolsos por peticiones
//    simultáneas (doble clic, dos admins a la vez).
export const updatePlayerPaymentMethod = async (req, res) => {
    const { matchId, userId } = req.params;
    const { method } = req.body || {};

    if (typeof method !== 'string' || !method.trim()) {
        return res.status(400).json({
            ok: false,
            message: 'Payment method is required'
        });
    }

    const newMethod = method.trim().toLowerCase();

    if (newMethod === 'booker') {
        return res.status(400).json({
            ok: false,
            message: 'This payment method cannot be assigned manually'
        });
    }

    const session = await mongoose.startSession();
    let updatedMatch = null;

    try {
        await session.withTransaction(async () => {

            const match = await Match.findById(matchId)
                .populate('createdBy', 'walletPaymentAllowed')
                .session(session);

            if (!match) {
                throw httpError(404, 'Match not found');
            }

            if (PAYMENT_LOCKED_STATUSES.includes(match.status)) {
                throw httpError(400, 'Payments cannot be edited for a closed match');
            }

            const player = match.players.find(
                p => p.user?.toString() === userId.toString()
            );

            if (!player) {
                throw httpError(404, 'Player not found for this match');
            }

            const currentMethod = player.payment?.method;
            const currentStatus = player.payment?.status;

            if (currentMethod === 'booker') {
                throw httpError(400, "The booker's payment method cannot be changed");
            }

            if (currentMethod === newMethod) {
                throw httpError(400, 'The player already has this payment method');
            }

            const isAllowedMethod = match.paymentMethods.some(pm => pm.type === newMethod);

            if (!isAllowedMethod) {
                throw httpError(400, 'This payment method is not available for this match');
            }

            // Importe guardado al unirse; si no existe (partidos antiguos), se
            // calcula igual que en joinMatch (redondeado a 2 decimales).
            const storedAmount = Number(player.payment?.amount);
            const amount = storedAmount > 0
                ? storedAmount
                : Math.round((match.price / match.maxPlayers) * 100) / 100;

            const formattedDate = new Date(match.date).toLocaleDateString("es-ES");

            let newStatus = currentStatus === 'paid' ? 'paid' : 'unpaid';

            // --- Validaciones de wallet ANTES de mover dinero ---
            if (newMethod === 'wallet') {
                if (WALLET_CHARGE_BLOCKED_STATUSES.includes(match.status)) {
                    throw httpError(400, 'Wallet funds cannot be used to pay for a match that has already been played or was cancelled');
                }

                if (!match.createdBy?.walletPaymentAllowed) {
                    throw httpError(400, 'Wallet payment is not available for this match');
                }
            }

            // --- 1. Actualización atómica del partido (condicionada al método actual) ---
            if (newMethod === 'wallet') newStatus = 'paid';
            if (currentMethod === 'wallet') newStatus = 'unpaid';

            const confirmationUpdate = newStatus === 'paid'
                ? (currentStatus === 'paid'
                    ? {} // ya estaba pagado: se conserva quién/cuándo lo confirmó
                    : {
                        $set: {
                            "players.$.payment.confirmedAt": new Date(),
                            "players.$.payment.confirmedBy": req.user._id
                        }
                    })
                : {
                    $unset: {
                        "players.$.payment.confirmedAt": "",
                        "players.$.payment.confirmedBy": ""
                    }
                };

            updatedMatch = await Match.findOneAndUpdate(
                {
                    _id: matchId,
                    players: {
                        $elemMatch: {
                            user: userId,
                            "payment.method": currentMethod
                        }
                    }
                },
                {
                    $set: {
                        "players.$.payment.method": newMethod,
                        "players.$.payment.status": newStatus,
                        "players.$.payment.amount": amount,
                        ...(confirmationUpdate.$set || {})
                    },
                    ...(confirmationUpdate.$unset ? { $unset: confirmationUpdate.$unset } : {})
                },
                { new: true, session }
            );

            if (!updatedMatch) {
                throw httpError(409, 'This payment was updated by someone else. Please refresh and try again.');
            }

            // --- 2. Movimientos de wallet ---
            if (currentMethod === 'wallet') {
                await User.findByIdAndUpdate(
                    userId,
                    { $inc: { walletBalance: amount } },
                    { session }
                );

                await WalletTransaction.create([{
                    user: userId,
                    amount,
                    type: "refund",
                    status: "confirmed",
                    note: `Refund - payment method changed by admin/booker ${formattedDate}`,
                    match: match._id
                }], { session });
            }

            if (newMethod === 'wallet') {
                // Descuento atómico: solo se aplica si el saldo alcanza.
                const charged = await User.findOneAndUpdate(
                    { _id: userId, walletBalance: { $gte: amount } },
                    { $inc: { walletBalance: -amount } },
                    { new: true, session }
                );

                if (!charged) {
                    // Aborta la transacción completa (incluido el paso 1).
                    throw httpError(400, "The player's wallet balance is insufficient");
                }

                await WalletTransaction.create([{
                    user: userId,
                    amount: -amount,
                    type: "match_payment",
                    status: "confirmed",
                    note: `Match payment - method changed by admin/booker ${formattedDate}`,
                    match: match._id
                }], { session });
            }
        });

        return res.status(200).json({
            ok: true,
            message: 'Payment method updated',
            updatedMatch
        });

    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({
            ok: false,
            message: error.status ? error.message : 'Error updating payment method'
        });
    } finally {
        session.endSession();
    }
};

export const getAdmins = async(req, res) =>{
    try {

        const user = await User.find({
            role: 'admin', isActive: true
        }).select('name lastname email phone role country receivesPayment')

        if(!user) return res.status(200).json({
            ok: false,
            message: 'Admins not found'
        })

        return res.status(200).json(user)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error obtaining admin data'
        })
    }
}

export const updatePaymentRecepient = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        const user = await User.findById(id).session(session);

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                ok: false,
                message: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                ok: false,
                message: 'User is not an admin'
            });
        }

        // 1. Reset todos
        await User.updateMany(
            { role: 'admin' },
            { $set: { receivesPayment: false } },
            { session }
        );

        // 2. Set solo uno (SIN save)
        await User.findByIdAndUpdate(
            id,
            { $set: { receivesPayment: true } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            ok: true,
            message: 'Payment recipient updated'
        });

    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            ok: false,
            message: 'Internal updating payment recepient'
        });
    }
};