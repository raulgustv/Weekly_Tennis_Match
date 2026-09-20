import {shuffleArray} from './createPairs.js'

const DEFAULT_K = 32;

const NTRP_MIDPOINT = 3.0;
const NTRP_TO_RATING_SPREAD = 150

export const seedRatingFromNTRP = (ntrplvl) =>{
    if(!ntrplvl) return 1000;
    return Math.round(1000 + (ntrplvl - NTRP_MIDPOINT) * NTRP_TO_RATING_SPREAD);
}

//internal reference
export const ratingToNTRPReference = (rating) =>{
    return Number((NTRP_MIDPOINT + (rating - 1000) / NTRP_TO_RATING_SPREAD).toFixed(2));
}

export const marginMultiplier = (gamesWinner, gamesLoser) => {
    const totalGames = gamesWinner - gamesLoser;

    if(!totalGames) return 1;

    const marginRatio = (gamesWinner - gamesLoser) / totalGames;
    const multiplier = 0.7 + 0.6 * marginRatio

    return Math.min(1.3, Math.max(0.7, multiplier))
}

export const expectedScore = (ratingA, ratingB) =>{
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export const sumGames = (sets, winnerIsA) => {
    return sets.reduce((acc, s) => {
        const winnerGames = winnerIsA ? s.gamesA : s.gamesB;
        const loserGames = winnerIsA ? s.gamesB : s.gamesA;
        acc.gamesWinner += winnerGames;
        acc.gamesLoser += loserGames;
        return acc;
    }, { gamesWinner: 0, gamesLoser: 0 });
};

export const computeRatingDelta = ({
    ratingWinner,
    ratingLoser,
    gamesWinner,
    gamesLoser,
    K = DEFAULT_K   
}) => {
    const expectedWinner = expectedScore(ratingWinner, ratingLoser);
    const multiplier = marginMultiplier(gamesWinner, gamesLoser);
    const delta = Math.round(K * multiplier * (1 - expectedWinner))

    return {
        winnerDelta: delta,
        loserDelta: -delta,
        multiplier
    }
}

//matchPairing antirepeticion
const getId = (p) => p.userId?.toString?.() ?? p._id?.toString?.() ?? p.toString();

const wereRecentOpponents = (idA, idB, recentMatches, currentRound, lookbackRounds) => {
    return recentMatches.some(m => {
        if (m.round <= currentRound - lookbackRounds) return false;
        const a = m.playerA.toString();
        const b = m.playerB.toString();
        return (a === idA && b === idB) || (a === idB && b === idA);
    });
};

const scorePairSingles = (a, b, recentMatches, currentRound, lookbackRounds, relaxLevel) => {
    let score = Math.abs(a.rating - b.rating);

    if (wereRecentOpponents(getId(a), getId(b), recentMatches, currentRound, lookbackRounds)) {
        if (relaxLevel === 0) score += 1000;
        else if (relaxLevel === 1) score += 400;
        else score += 50;
    }

    return score;
};

export const generateRankingPairs = (players, recentMatches = [], currentRound, lookbackRounds = 2) => {
    let relaxLevel = 0;
    let finalPairs = [];
    let byePlayer = null;

    const targetPairs = Math.floor(players.length / 2);

    while (relaxLevel <= 2) {
        const pool = shuffleArray(players);
        const pairs = [];
        let bye = null;

        if (pool.length % 2 !== 0) {
            bye = pool.pop();
        }

        while (pool.length >= 2) {
            let bestI = -1;
            let bestJ = -1;
            let bestScore = Infinity;

            for (let i = 0; i < pool.length; i++) {
                for (let j = i + 1; j < pool.length; j++) {
                    const score = scorePairSingles(
                        pool[i], pool[j], recentMatches, currentRound, lookbackRounds, relaxLevel
                    );

                    if (score < bestScore) {
                        bestScore = score;
                        bestI = i;
                        bestJ = j;
                    }
                }
            }

            if (bestI === -1) break;

            pairs.push({ playerA: pool[bestI], playerB: pool[bestJ] });
            pool.splice(bestJ, 1);
            pool.splice(bestI, 1);
        }

        if (pairs.length === targetPairs) {
            finalPairs = pairs;
            byePlayer = bye ? getId(bye) : null;
            break;
        }

        relaxLevel++;
    }

    return { pairs: finalPairs, byePlayer };
};