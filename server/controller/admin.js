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

/*
  🔵 CAMBIO: esta función ya existía, pero solo la podía usar 'admin'
  (routes/admin.js ahora usa verifyBookerOrAdmin, así que 'booker' también
  puede). Además tenía un bug: al auto-promocionar un backup hacía
  match.backUps.shift() + match.players.push(promotedUser) a pelo, sin
  adaptar el payment al esquema nuevo. Ahora usa promoteNextBackup() (el
  mismo helper que usa leaveMatch), refund de wallet si aplica, y notifica
  tanto al retirado como al promocionado.

  Admin / booker manual removal.
  Unlike a player leaving on their own, this is NOT blocked by the
  24-hour deadline — an admin or booker can remove a player or backup
  at any point up until the match starts. Wallet holds are refunded,
  the next waiting backup (if any) is auto-promoted into the freed
  spot, and both the removed user and the promoted user are notified.
*/
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

        // 🔵 CAMBIO: antes solo hacía el filter/save, sin refund de wallet.
        if(isBackup){
            match.backUps = match.backUps.filter(p => p.user.toString() !== playerId.toString())

            await match.save({session})

            await refundBackupWallet({
                backup: backupObj,
                userId: playerId,
                match,
                session,
                note: `Backup refund - removed by admin/booker from match ${match._id}`
            });

            removedUserId = playerId;
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

export const togglePaymentStatus = async(req, res) =>{
    const {matchId, userId} = req.params;  

    try {

        if(!matchId || !userId){
            return res.status(500).json({
                ok: false,
                message: 'Match or user not provided'
            })
        }

        const match = await Match.findOne(
            {_id: matchId, "players.user": userId},
            {'players.$': 1, date: 1}
        );

        if(!match || !match.players.length){
             return res.status(500).json({
                ok: false,
                message: 'Player not found for this match'
            })
        }

        const player = match?.players[0];
        const currentStatus = player.payment.status;
        const newStatus = currentStatus === "paid" ? "unpaid" : "paid";

        // update atómico — solo cambia el status, nada de wallet
        const updatedMatch = await Match.findOneAndUpdate(
            {_id: matchId, "players.user": userId},
            {
                $set:{
                    "players.$.payment.status": newStatus
                }
            }, {new: true}
        )

        return res.status(200).json({
            message: "Payment status updated",
            updatedMatch
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Error updating payment status'
        })
    }
}
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