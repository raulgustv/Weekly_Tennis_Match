import Ranking from "../models/Ranking.js";
import RankingMatch from "../models/RankingMatch.js";
import Season from "../models/Season.js";
import User from "../models/user.js";
import { buildMadridDateTime, addRoundInterval, computeRoundWindow } from "../helpers/dateHelpers.js";
import { generateRankingPairs, seedRatingFromNTRP } from "../utils/rankingEngine.js";
//import { generateRankingPairs, seedRatingFromNtrp } from "../helpers/rankingEngine.js";



const DEFAULT_LOOKBACK_ROUNDS = 2;
export const PENALTY_SUSPENSION_ROUNDS = { 3: 2, 4: 3 };
export const PENALTY_REMOVAL_POINTS = 5;

export const getPenaltyTier = (points = 0) => {
    if (points >= 5) return 5;
    if (points >= 4) return 4;
    if (points >= 3) return 3;
    return 0;
};

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

export const applyPenaltySuspensions = async ({ seasonId } = {}) => {
    const season = await resolveSeason(seasonId);

    const candidates = await Ranking.find({
        season: season._id,
        status: { $in: ['active', 'suspended', 'retired'] },
        penaltyPoints: { $gte: 3 }
    }).select('_id userId status penaltyPoints suspensionTier suspendedUntilRound');

    const pending = candidates.filter(r => getPenaltyTier(r.penaltyPoints) > (r.suspensionTier || 0));
    if (!pending.length) return { sanctions: [] };

    const lastPublished = await RankingMatch.findOne({ season: season._id, published: true })
        .sort({ round: -1 })
        .select('round')
        .lean();
    const lastRound = lastPublished?.round ?? 0;

    const sanctions = [];
    let activePlayersLeft = false;

    for (const r of pending) {
        const tier = getPenaltyTier(r.penaltyPoints);
        // `$not: { $gte: tier }` también cubre documentos antiguos sin el campo
        const guard = { _id: r._id, suspensionTier: { $not: { $gte: tier } } };

        if (tier >= PENALTY_REMOVAL_POINTS) {
            const result = await Ranking.updateOne(guard, {
                $set: {
                    status: 'removed',
                    suspensionTier: tier,
                    suspendedUntilRound: null,
                    removedAt: new Date(),
                    removedBy: null, // null = automático
                    removedReason: 'Automatic removal: 5 penalty points (2-year suspension)'
                }
            });
            if (result.modifiedCount === 1) {
                sanctions.push({ userId: r.userId, action: 'removed', tier, suspendedUntilRound: null });
                if (r.status === 'active') activePlayersLeft = true;
            }
            continue;
        }

        // Nunca se acorta una suspensión que ya tuviera
        const firstRoundBack = Math.max(
            r.suspendedUntilRound ?? 0,
            lastRound + 1 + PENALTY_SUSPENSION_ROUNDS[tier]
        );
        const $set = { suspensionTier: tier, suspendedUntilRound: firstRoundBack };
        if (r.status === 'active') $set.status = 'suspended';

        const result = await Ranking.updateOne(guard, { $set });
        if (result.modifiedCount === 1) {
            sanctions.push({ userId: r.userId, action: 'suspended', tier, suspendedUntilRound: firstRoundBack });
            if (r.status === 'active') activePlayersLeft = true;
        }
    }

    // El jugador sancionado pierde su posición: se recalculan las de los activos
    // (mismo criterio que tras un resultado: rating descendente)
    if (activePlayersLeft) {
        const actives = await Ranking.find({ season: season._id, status: 'active' })
            .sort({ rating: -1 })
            .select('_id');
        if (actives.length) {
            await Ranking.bulkWrite(actives.map((doc, index) => ({
                updateOne: { filter: { _id: doc._id }, update: { $set: { rank: index + 1 } } }
            })));
        }
    }

    return { sanctions };
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

        // CHANGE (NUEVO): + 'rankingBan.active' — un expulsado nunca entra en una propuesta
    const rankedUsers = await User.find({
        isRanked: true,
        isActive: true,
        'rankingBan.active': { $ne: true }
    }).select('_id ntrplvl');

    // CHANGE: ahora también se lee `suspendedUntilRound`, para devolver al ranking
    // a los suspendidos cuya sanción ya terminó (ver bloque de reactivación abajo).
    const existing = await Ranking.find({ season: season._id }).select('userId rank status suspendedUntilRound');
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
            reactivations.push({
                updateOne: {
                    filter: { _id: current._id, status: 'retired' },
                    update: { $set: { status: 'active', rank: nextRank, dateOfLeave: null } }
                }
            });
        }        // CHANGE (NUEVO): suspensión por penalty points terminada.
        // Reglamento: "Suspended players will lose their ranking position" → vuelve
        // en la ÚLTIMA posición (igual que un reactivado), conservando su rating.
        // `suspendedUntilRound` = primera ronda en la que puede jugar. Si es null
        // (suspensión manual sin fecha) NO se toca: sigue suspendido hasta que un
        // admin lo cambie. `suspensionTier` se conserva para no volver a sancionar
        // el mismo tramo.
        else if (
            current.status === 'suspended' &&
            current.suspendedUntilRound != null &&
            current.suspendedUntilRound <= round
        ) {
            nextRank += 1;
            reactivations.push({
                updateOne: {
                    filter: { _id: current._id, status: 'suspended' },
                    update: { $set: { status: 'active', rank: nextRank, suspendedUntilRound: null } }
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

        // CHANGE (NUEVO): suspensión automática por penalty points (Reglamento).
    // Va ANTES de proponer la ronda siguiente, para que los sancionados no
    // entren en ella. Con try/catch a propósito: si fallara y se lanzara el
    // error, el cron no avanzaría nextRoundCloseDate y reintentaría cada minuto.
    // Al ser idempotente, un fallo aquí se recupera en la siguiente llamada.
    let sanctionedCount = 0;
    try {
        const { sanctions } = await applyPenaltySuspensions({ seasonId: season._id });
        sanctionedCount = sanctions.length;
    } catch (suspensionError) {
        console.log(suspensionError);
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

        return { disputedCount: unresolvedMatches.length, sanctionedCount, ...nextRoundResult }; // CHANGE: + sanctionedCount
};