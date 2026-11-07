import mongoose from "mongoose";
import Ranking from "../models/Ranking.js";
import RankingPenalty from "../models/RankingPenalty.js";
import RankingMatch from "../models/RankingMatch.js";
import Season from "../models/Season.js";
import User from "../models/user.js";
import { applyPenaltySuspensions } from "../services/rankingServices.js";

const DUPLICATE_WINDOW_MS = 30 * 1000;

const SUSPENSION_THRESHOLD = 3

export const issueRankingPenalty = async(req, res) => {

    const session = await mongoose.startSession();

    try {

        if(req.user.role !== 'admin'){
            res.status(403).json({
                ok: false,
                message: 'You are not authorized to issue penalty points'
            })
        }

        const {userId, category, note} = req.body;

        if(String(req.user._id) === String(userId)){
            res.status(400).json({
                ok: false,
                message: 'You cannot issue a penalty point to yourself'
            })
        }

        session.startTransaction();

        const season = await Season.findOne({status: 'active'}).select('_id').session(session);

        if(!season){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'There is no active season currently'
            })
        }

        const userExists = await User.exists({_id: userId}).session(session)

        if(!userExists){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'Player not found'
            })
        }

        const ranking = await Ranking.findOne({userId, season: season._id}).select('_id status').session(session);

        if(!ranking){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'This player is not participating in the ranking'
            })
        }

        if(ranking.status === 'removed'){
            await session.abortTransaction();
            return res.status(400).json({
                ok: false,
                message: 'This player has already been removed from the ranking'
            })
        }

        //no double click
        const recentDuplicate = await RankingPenalty.exists({
            season: season._id,
            userId,
            category,
            issuedBy: req.user._id,
            createdAt: {$gte: new Date(Date.now() - DUPLICATE_WINDOW_MS)}
        }).session(session)

        if(recentDuplicate){
            await session.abortTransaction();
            return res.status(409).json({
                ok: false,
                message: 'Penalty point just issued'
            })
        }

        await RankingPenalty.create({
            season: season._id,
            userId,
            ranking: ranking._id,
            category,
            note,
            source: 'admin',
            issuedBy: req.user._id
        });

        const updated = await Ranking.findOneAndUpdate(
            {_id: ranking._id, status: {$ne: 'removed'}},
            {$inc: {penaltyPoints: 1}},
            {new: true, session}
        ).select('penaltyPoints')

        if(!updated){
            await session.abortTransaction();
            return res.status(409).json({
                ok: false,
                message: 'Player was updated at the same time'
            })
        }

        await session.commitTransaction();

        let sanction = null;
        let suspensionCheckedFaied = false;

        try {

            const {sanctions} = await applyPenaltySuspensions({seasonId: season._id});

            sanction = sanctions.find(s => String(s.userId) === String(userId)) || null
            
        } catch (error) {
            console.log(error);
            suspensionCheckedFaied: true
        }

        return res.status(201).json({
            ok: true,
            message: 'Penalty point issuesd',
            penaltyPoints: updated.penaltyPoints,
            sanction,
            suspensionCheckedFaied
        })

        
    } catch (error) {
        console.log(error)

        if(session.inTransaction()) await session.abortTransaction();
        res.status(500).json({
            ok: false,
            message: 'Server error issuing penalty to user'
        })
    } finally{
        session.endSession()
    }

}


/**
 * CHANGE (NUEVO): POST /ranking/players/:userId/remove (solo admin)
 * Body: { reason } — el jugador VERÁ este texto.
 * Expulsión permanente del ranking:
 *  1) User: rankingBan activo + isRanked=false (no puede volver a inscribirse).
 *  2) Ranking de la temporada activa: status 'removed' + auditoría.
 *  3) Partidos sin jugar: los PUBLICADOS pasan a 'cancelled' (así closeRound no
 *     penaliza al rival sin culpa); los de una propuesta SIN publicar se borran
 *     (igual que "discard"), el rival aparecerá como sin pareja.
 *  4) Se recalculan las posiciones de los activos.
 * Los partidos ya jugados y su rating NO se tocan.
 * Todo dentro de una transacción.
 */
export const removePlayerFromRanking = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ ok: false, message: 'You are not authorized to remove players from the ranking' });
        }

        const { userId } = req.params;
        const { reason } = req.body;

        if (String(userId) === String(req.user._id)) {
            return res.status(400).json({ ok: false, message: 'You cannot remove yourself from the ranking' });
        }

        session.startTransaction();

        const user = await User.findById(userId).select('role rankingBan').session(session);

        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ ok: false, message: 'Player not found' });
        }

        // Una cuenta de administrador no se expulsa por esta vía
        if (user.role === 'admin') {
            await session.abortTransaction();
            return res.status(400).json({ ok: false, message: 'Administrators cannot be removed from the ranking' });
        }

        if (user.rankingBan?.active) {
            await session.abortTransaction();
            return res.status(409).json({ ok: false, message: 'This player has already been removed from the ranking' });
        }

        const now = new Date();

        // 1) Expulsión a nivel de usuario (vale para todas las temporadas)
        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    isRanked: false,
                    'rankingBan.active': true,
                    'rankingBan.reason': reason,
                    'rankingBan.bannedAt': now,
                    'rankingBan.bannedBy': req.user._id
                }
            },
            { session }
        );

        let cancelledMatches = 0;
        let removedDraftMatches = 0;

        // Puede no haber temporada activa (entre temporadas): la expulsión de User vale igual
        const season = await Season.findOne({ status: 'active' }).select('_id').session(session);

        if (season) {
            // 2) Entrada de la temporada activa
            const rankingResult = await Ranking.updateMany(
                { userId, season: season._id, status: { $ne: 'removed' } },
                {
                    $set: {
                        status: 'removed',
                        suspendedUntilRound: null,
                        removedAt: now,
                        removedBy: req.user._id,
                        removedReason: reason
                    }
                },
                { session }
            );

            // 3) Partidos sin jugar donde participa
            const unplayed = {
                season: season._id,
                status: 'scheduled',
                $or: [{ playerA: userId }, { playerB: userId }]
            };

            const drafts = await RankingMatch.deleteMany({ ...unplayed, published: false }, { session });
            removedDraftMatches = drafts.deletedCount;

            const published = await RankingMatch.updateMany(
                { ...unplayed, published: true },
                { $set: { status: 'cancelled', notes: 'Cancelled automatically: a player was removed from the ranking' } },
                { session }
            );
            cancelledMatches = published.modifiedCount;

            // 4) Posiciones de los activos (mismo criterio que tras un resultado)
            if (rankingResult.modifiedCount > 0) {
                const actives = await Ranking.find({ season: season._id, status: 'active' })
                    .sort({ rating: -1 })
                    .select('_id')
                    .session(session);

                if (actives.length) {
                    await Ranking.bulkWrite(
                        actives.map((doc, index) => ({
                            updateOne: { filter: { _id: doc._id }, update: { $set: { rank: index + 1 } } }
                        })),
                        { session }
                    );
                }
            }
        }

        await session.commitTransaction();

        return res.status(200).json({
            ok: true,
            message: 'Player removed from the ranking',
            cancelledMatches,
            removedDraftMatches
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        if (error?.hasErrorLabel?.('TransientTransactionError') || error?.code === 112) {
            return res.status(409).json({ ok: false, message: 'The player was updated at the same time. Please refresh and try again' });
        }
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Internal error removing the player from the ranking' });
    } finally {
        session.endSession();
    }
};