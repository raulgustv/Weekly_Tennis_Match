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
    // CHANGE (BUG): antes `gamesWinner - gamesLoser` → ratio = diff/diff = 1 siempre → multiplicador SIEMPRE 1.3.
    const totalGames = gamesWinner + gamesLoser;

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

//NTRP CHANGES
const NTRP_K = 0.10;
const NTRP_MAX_DELTA_PER_MATCH = 0.15;
const NTRP_MIN = 1;
const NTRP_MAX = 5;

const round2 = (value) => Math.round(value * 100) / 100;

const clampNtrp = (value) => Math.min(NTRP_MAX, Math.max(NTRP_MIN, value));

export const computeNtrpDelta = ({ntrpWinner, ntrpLoser,gamesWinner,gamesLoser,K = NTRP_K}) => {
    const nW = Number(ntrpWinner);
    const nL = Number(ntrpLoser);

    if(!Number.isFinite(nW) || !Number.isFinite(nL) || nW <= 0 || nL <= 0){
        return null;
    }

    const expectedWinner = expectedScore(nW * NTRP_TO_RATING_SPREAD, nL * NTRP_TO_RATING_SPREAD);
    const multiplier = marginMultiplier(gamesWinner, gamesLoser)

    const rawDelta = K * multiplier * (1 - expectedWinner);
    const delta = round2(Math.min(NTRP_MAX_DELTA_PER_MATCH, Math.max(0, rawDelta)));

    const newNtrpWinner = round2(clampNtrp(nW + delta))
    const newNtrpLoser = round2(clampNtrp(nL - delta))

    return {
        winnerDelta: round2(newNtrpWinner - nW),
        loserDelta: round2(newNtrpLoser - nL),
        newNtrpWinner,
        newNtrpLoser,
        multiplier
    }
}

export const undoNtrpDelta = (currentNtrp, previousDelta) =>{
    return round2(clampNtrp(Number(currentNtrp) - Number(previousDelta)))
}

//matchPairing antirepeticion
const getId = (p) => p.userId?.toString?.() ?? p._id?.toString?.() ?? p.toString();

const wereRecentOpponents = (idA, idB, recentMatches, currentRound, lookbackRounds) => {
    return recentMatches.some(m => {
        if (m.round <= currentRound - lookbackRounds) return true;
        const a = m.playerA.toString();
        const b = m.playerB.toString();
        return (a === idA && b === idB) || (a === idB && b === idA);
    });
};

// const scorePairSingles = (a, b, recentMatches, currentRound, lookbackRounds, relaxLevel) => {
//     let score = Math.abs(a.rating - b.rating);

//     if (wereRecentOpponents(getId(a), getId(b), recentMatches, currentRound, lookbackRounds)) {
//         if (relaxLevel === 0) score += 1000;
//         else if (relaxLevel === 1) score += 400;
//         else score += 50;
//     }

//     return score;
// };

// export const generateRankingPairs = (players, recentMatches = [], currentRound, lookbackRounds = 2) => {
//     let relaxLevel = 0;
//     let finalPairs = [];
//     let byePlayer = null;

//     const targetPairs = Math.floor(players.length / 2);

//     while (relaxLevel <= 2) {
//         const pool = shuffleArray(players);
//         const pairs = [];
//         let bye = null;

//         if (pool.length % 2 !== 0) {
//             bye = pool.pop();
//         }

//         while (pool.length >= 2) {
//             let bestI = -1;
//             let bestJ = -1;
//             let bestScore = Infinity;

//             for (let i = 0; i < pool.length; i++) {
//                 for (let j = i + 1; j < pool.length; j++) {
//                     const score = scorePairSingles(
//                         pool[i], pool[j], recentMatches, currentRound, lookbackRounds, relaxLevel
//                     );

//                     if (score < bestScore) {
//                         bestScore = score;
//                         bestI = i;
//                         bestJ = j;
//                     }
//                 }
//             }

//             if (bestI === -1) break;

//             pairs.push({ playerA: pool[bestI], playerB: pool[bestJ] });
//             pool.splice(bestJ, 1);
//             pool.splice(bestI, 1);
//         }

//         if (pairs.length === targetPairs) {
//             finalPairs = pairs;
//             byePlayer = bye ? getId(bye) : null;
//             break;
//         }

//         relaxLevel++;
//     }

//     return { pairs: finalPairs, byePlayer };
// };
// =====================================================================
// CHANGE (BUG + BALANCE): NUEVO emparejamiento.
// Antes: voraz global determinista → siempre la misma propuesta y, al final,
// los sobrantes quedaban emparejados con rivales muy lejanos.
// Ahora: se ordena por rating y se empareja con el vecino más cercano (esto
// minimiza las diferencias). Un ruido aleatorio al ordenar da variedad entre
// propuestas, y cada intento se VALIDA contra límites de equilibrio.
// =====================================================================

// Ruido (± puntos de rating) al ordenar. 40 ≈ 0.27 NTRP.
const PAIRING_JITTER = 40;
const PAIRING_ATTEMPTS_PER_LEVEL = 200;

// De más estricto a más relajado. Rating: 150 puntos = 1.0 NTRP.
// Se prefiere repetir rival antes que un partido muy desnivelado.
const PAIRING_LEVELS = [
    { maxGap: 75,  allowRematch: false }, // ≤ 0.5 NTRP y sin rematch reciente
    { maxGap: 150, allowRematch: false }, // ≤ 1.0 NTRP y sin rematch reciente
    { maxGap: 75,  allowRematch: true  }, // ≤ 0.5 NTRP aunque sea rematch
    { maxGap: 150, allowRematch: true  }  // ≤ 1.0 NTRP aunque sea rematch
];

// Una tentativa: ordena por rating + ruido y junta vecinos de 2 en 2.
const buildSortedPairs = (pool, jitter = PAIRING_JITTER) => {
    const sorted = pool
        .map(p => ({ p, key: p.rating + (Math.random() * 2 - 1) * jitter }))
        .sort((x, y) => x.key - y.key)
        .map(x => x.p);

    const pairs = [];
    for (let i = 0; i + 1 < sorted.length; i += 2) {
        // Se aleatoriza quién es playerA para que no sea siempre el de menor rating
        pairs.push(
            Math.random() < 0.5
                ? { playerA: sorted[i], playerB: sorted[i + 1] }
                : { playerA: sorted[i + 1], playerB: sorted[i] }
        );
    }
    return pairs;
};

const isValidPairing = (pairs, level, recentMatches, currentRound, lookbackRounds) =>
    pairs.every(({ playerA, playerB }) => {
        if (Math.abs(playerA.rating - playerB.rating) > level.maxGap) return false;
        if (
            !level.allowRematch &&
            wereRecentOpponents(getId(playerA), getId(playerB), recentMatches, currentRound, lookbackRounds)
        ) return false;
        return true;
    });

export const generateRankingPairs = (players, recentMatches = [], currentRound, lookbackRounds = 2) => {
    // El bye se elige al azar y ANTES de emparejar (igual que antes), para que
    // no recaiga siempre en el jugador más extremo.
    const pool = shuffleArray(players);
    const bye = pool.length % 2 !== 0 ? pool.pop() : null;
    const byePlayer = bye ? getId(bye) : null;

    if (pool.length < 2) return { pairs: [], byePlayer };

    for (const level of PAIRING_LEVELS) {
        for (let i = 0; i < PAIRING_ATTEMPTS_PER_LEVEL; i++) {
            const pairs = buildSortedPairs(pool);
            if (isValidPairing(pairs, level, recentMatches, currentRound, lookbackRounds)) {
                return { pairs, byePlayer };
            }
        }
    }

    // Último recurso: ningún intento cumplió los límites (p. ej. un jugador muy
    // por encima del resto). Emparejamiento ordenado puro, sin ruido: es el que
    // minimiza la diferencia total.
    console.warn('[ranking] Pairing fallback used: no pairing met the balance limits');
    return { pairs: buildSortedPairs(pool, 0), byePlayer };
};