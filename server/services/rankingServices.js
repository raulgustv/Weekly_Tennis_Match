import Ranking from "../models/Ranking.js";
import RankingMatch from "../models/RankingMatch.js";
import Season from "../models/Season.js";
import User from "../models/user.js";
import { buildMadridDateTime, addRoundInterval, computeRoundWindow } from "../helpers/dateHelpers.js";
import { generateRankingPairs, seedRatingFromNTRP } from "../utils/rankingEngine.js";
//import { generateRankingPairs, seedRatingFromNtrp } from "../helpers/rankingEngine.js";



const DEFAULT_LOOKBACK_ROUNDS = 2;

export const resolveSeason = async (seasonId) => {
    if (seasonId) {
        const season = await Season.findById(seasonId);
        if (!season) throw new Error('Season not found');
        return season;
    }

    const activeSeason = await Season.findOne({ status: 'active' });
    if (!activeSeason) throw new Error('There is no active season configured');
    return activeSeason;
};

const getNextRoundNumber = async (seasonId) => {
    const lastMatch = await RankingMatch.findOne({ season: seasonId }).sort({ round: -1 }).select('round');
    return (lastMatch?.round || 0) + 1;
};

// CHANGE (NUEVO): ronda propuesta y AÚN SIN PUBLICAR de la temporada (o null).
// La usan el controller (bloquear una 2ª propuesta encima → antes se creaban
// partidos duplicados) y closeRound (hueco nº 7: el cron generaba otra propuesta
// encima de una que el admin no había publicado → partidos huérfanos).
export const findPendingProposalRound = async (seasonId) => {
    const pending = await RankingMatch.findOne({ season: seasonId, published: false })
        .sort({ round: -1 })
        .select('round')
        .lean();
    return pending?.round ?? null;
};

// CHANGE (NUEVO): ronda PUBLICADA que todavía tiene partidos sin resultado
// ('scheduled'), es decir, la ronda en juego (o null). Sirve para no proponer
// la siguiente ronda mientras la actual sigue abierta (habría dos rondas
// publicadas a la vez y closeRound penalizaría las dos).
export const findOpenPublishedRound = async (seasonId) => {
    const open = await RankingMatch.findOne({ season: seasonId, published: true, status: 'scheduled' })
        .sort({ round: -1 })
        .select('round')
        .lean();
    return open?.round ?? null;
};

/**
 * Asegura un Ranking doc por cada usuario isRanked (seed desde ntrplvl),
 * empareja evitando repetir rival de las últimas 2 rondas, y crea los
 * RankingMatch con published:false.
 */
export const generateRankingRoundProposal = async ({ seasonId, round } = {}) => {
    const season = await resolveSeason(seasonId);

    if (!round) {
        round = await getNextRoundNumber(season._id);
    }

    const rankedUsers = await User.find({ isRanked: true, isActive: true }).select('_id ntrplvl');

    // CHANGE: ahora también se lee `status`, para detectar jugadores que se
    // retiraron y se han vuelto a apuntar (ver bloque de reactivación abajo).
    const existing = await Ranking.find({ season: season._id }).select('userId rank status');
    const existingByUser = new Map(existing.map(r => [r.userId.toString(), r]));

    let nextRank = existing.length ? Math.max(...existing.map(r => r.rank)) : 0;
    const newRankingDocs = [];
    const reactivations = [];

    for (const u of rankedUsers) {
        const current = existingByUser.get(u._id.toString());

        if (!current) {
            nextRank += 1;
            newRankingDocs.push({
                season: season._id,
                userId: u._id,
                rank: nextRank,
                // CHANGE (BUG): antes llamaba a seedRatingFromNtrp, pero lo importado es
                // seedRatingFromNTRP → ReferenceError en cuanto había un jugador nuevo,
                // es decir, la PRIMERA propuesta de ronda tras cualquier registro fallaba.
                rating: seedRatingFromNTRP(u.ntrplvl),
                seedNtrpLevel: u.ntrplvl ?? null,
                status: 'active'
            });
        } else if (current.status === 'retired') {
            // CHANGE (BUG): NUEVO. Antes, si un jugador se daba de baja y luego se
            // volvía a registrar en la misma temporada, ya existía su Ranking doc
            // (status 'retired'), así que no se creaba otro y tampoco se reactivaba:
            // quedaba isRanked=true pero NUNCA entraba en ninguna ronda.
            // Reglamento: "New players and reactivated players will have the last
            // ranking position" → se reactiva en la última posición. Se CONSERVA
            // su rating (no se resetea), para que retirarse y volver no sirva
            // para "limpiar" un rating bajo o alto. Los 'suspended' NO se tocan.
            nextRank += 1;
            reactivations.push({
                updateOne: {
                    filter: { _id: current._id, status: 'retired' },
                    update: { $set: { status: 'active', rank: nextRank, dateOfLeave: null } }
                }
            });
        }
    }

    if (newRankingDocs.length) {
        await Ranking.insertMany(newRankingDocs);
    }

    // CHANGE: NUEVO — aplica las reactivaciones
    if (reactivations.length) {
        await Ranking.bulkWrite(reactivations);
    }

    const eligible = await Ranking.find({
        season: season._id,
        status: 'active',
        $or: [
            { suspendedUntilRound: null },
            { suspendedUntilRound: { $lte: round } }
        ]
    }).select('userId rating');

    const players = eligible.map(r => ({ userId: r.userId, rating: r.rating }));

    const recentMatches = await RankingMatch.find({
        season: season._id,
        round: { $gt: round - DEFAULT_LOOKBACK_ROUNDS - 1, $lt: round },
        status: { $ne: 'cancelled' }
    }).select('playerA playerB round');

    const { pairs, byePlayer } = generateRankingPairs(players, recentMatches, round, DEFAULT_LOOKBACK_ROUNDS);


    const matchDocs = pairs.map(p => ({
        season: season._id,
        round,
        playerA: p.playerA.userId,
        playerB: p.playerB.userId,
        ratingBefore: { playerA: p.playerA.rating, playerB: p.playerB.rating },
        status: 'scheduled',
        published: false
    }));

    const created = await RankingMatch.insertMany(matchDocs);

    return { season, round, matches: created, byePlayer };
};

/**
 * Cierra la ronda publicada que aún tenía partidos sin resultado y
 * propone la siguiente (llamando a generateRankingRoundProposal, sin
 * repetir su lógica). SIN req/res a propósito — la llama el cron
 * directamente y closeRoundNow (admin) en el controller.
 */
export const closeRound = async ({ seasonId } = {}) => {
    const season = await resolveSeason(seasonId);

    const unresolvedMatches = await RankingMatch.find({
        season: season._id,
        published: true,
        status: 'scheduled'
    });

    for (const match of unresolvedMatches) {
        match.status = 'disputed';
        match.penaltiesIssued.push(
            { player: match.playerA, reason: 'avoided_result_reporting', points: 1 },
            { player: match.playerB, reason: 'avoided_result_reporting', points: 1 }
        );
        await match.save();

        await Ranking.updateMany(
            { season: season._id, userId: { $in: [match.playerA, match.playerB] } },
            { $inc: { penaltyPoints: 1 } }
        );
    }

    // CHANGE (BUG, hueco nº 7): antes se generaba SIEMPRE una propuesta nueva. Si el
    // admin no había publicado la anterior, quedaban dos propuestas sin publicar
    // (y al publicar una ronda con la otra pendiente, partidos huérfanos). Ahora,
    // si ya hay una propuesta pendiente, se conserva y NO se genera otra: el admin
    // la publica o la descarta desde la página de rondas.
    // Importante: NO se lanza error aquí, porque si closeRound fallara el cron
    // no avanzaría nextRoundCloseDate y volvería a intentarlo cada minuto.
    const pendingRound = await findPendingProposalRound(season._id);

    const nextRoundResult = pendingRound
        ? { season, round: pendingRound, matches: [], byePlayer: null, reusedPendingProposal: true }
        : await generateRankingRoundProposal({ seasonId: season._id });

    // El instante en que cerró esta ronda es también el instante en que
    // ABRE la que se acaba de proponer.
    if (season.nextRoundCloseDate) {
        const { startDate, endDate } = computeRoundWindow(
            season.nextRoundCloseDate,
            season.roundCloseTime,
            season.roundIntervalDays
        );
        season.startDate = startDate;
        season.endDate = endDate;

        const currentClose = buildMadridDateTime(season.nextRoundCloseDate, season.roundCloseTime);
        const nextClose = addRoundInterval(currentClose, season.roundIntervalDays);
        season.nextRoundCloseDate = nextClose.toDate();

        await season.save();
    }

    return { disputedCount: unresolvedMatches.length, ...nextRoundResult };
};