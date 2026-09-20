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

    const existing = await Ranking.find({ season: season._id }).select('userId rank');
    const existingIds = new Set(existing.map(r => r.userId.toString()));

    let nextRank = existing.length ? Math.max(...existing.map(r => r.rank)) : 0;
    const newRankingDocs = [];

    for (const u of rankedUsers) {
        if (!existingIds.has(u._id.toString())) {
            nextRank += 1;
            newRankingDocs.push({
                season: season._id,
                userId: u._id,
                rank: nextRank,
                rating: seedRatingFromNtrp(u.ntrplvl),
                seedNtrpLevel: u.ntrplvl ?? null,
                status: 'active'
            });
        }
    }

    if (newRankingDocs.length) {
        await Ranking.insertMany(newRankingDocs);
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

    const nextRoundResult = await generateRankingRoundProposal({ seasonId: season._id });

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