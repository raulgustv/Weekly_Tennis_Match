// =======================================
// MATCH ENGINE - CLUB COMPETITIVO SERIO
// =======================================

// ---------- BASIC HELPERS ----------

export const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const averageNTRP = (pair) => {
    if (!pair || pair.length < 2) return null;

    const n1 = Number(pair[0].user?.ntrplvl);
    const n2 = Number(pair[1].user?.ntrplvl);

    if (isNaN(n1) || isNaN(n2)) return null;

    return Number(((n1 + n2) / 2).toFixed(2));
};

const getId = (p) => p.user._id.toString();

// ---------- HISTORY ----------

const wereTeammates = (id1, id2, previousMatches) => {
    return previousMatches.some(m => {
        const A = [m.teamA.player1.toString(), m.teamA.player2.toString()];
        const B = [m.teamB.player1.toString(), m.teamB.player2.toString()];

        return (
            (A.includes(id1) && A.includes(id2)) ||
            (B.includes(id1) && B.includes(id2))
        );
    });
};

// ---------- PAIR SCORING ----------

const scorePair = (a, b, previousMatches, relaxLevel) => {

    let score = 0;

    const diff = Math.abs(a.user.ntrplvl - b.user.ntrplvl);

    // Balance interno
    score += diff * 10;

    // Penalizar repetición pareja
    if (wereTeammates(getId(a), getId(b), previousMatches)) {
        if (relaxLevel === 0) score += 300;
        if (relaxLevel === 1) score += 150;
        if (relaxLevel >= 2) score += 30;
    }

    return score;
};

// ---------- GENERATE PAIRS ----------

export const generateCompetitivePairs = (players, previousMatches = []) => {

    let relaxLevel = 0;
    let success = false;
    let finalPairs = [];

    while (!success && relaxLevel <= 2) {

        const pool = shuffleArray(players);
        const pairs = [];

        while (pool.length >= 2) {

            let bestI = -1;
            let bestJ = -1;
            let bestScore = Infinity;

            for (let i = 0; i < pool.length; i++) {
                for (let j = i + 1; j < pool.length; j++) {

                    const score = scorePair(
                        pool[i],
                        pool[j],
                        previousMatches,
                        relaxLevel
                    );

                    if (score < bestScore) {
                        bestScore = score;
                        bestI = i;
                        bestJ = j;
                    }
                }
            }

            if (bestI === -1) break;

            pairs.push([pool[bestI], pool[bestJ]]);

            pool.splice(bestJ, 1);
            pool.splice(bestI, 1);
        }

        if (pairs.length === Math.floor(players.length / 2)) {
            success = true;
            finalPairs = pairs;
        } else {
            relaxLevel++;
        }
    }

    return finalPairs;
};

// ---------- MATCH SCORING ----------

export const generateBalancedMatches = (pairs, courts) => {

    const matches = [];
    const pool = [...pairs];

    const scoreMatch = (pairA, pairB) => {

        let score = 0;

        const avgDiff = Math.abs(
            averageNTRP(pairA) - averageNTRP(pairB)
        );

        score += avgDiff * 10;

        return score;
    };

    while (pool.length >= 2) {

        let bestI = 0;
        let bestJ = 1;
        let bestScore = Infinity;

        for (let i = 0; i < pool.length; i++) {
            for (let j = i + 1; j < pool.length; j++) {

                const score = scoreMatch(pool[i], pool[j]);

                if (score < bestScore) {
                    bestScore = score;
                    bestI = i;
                    bestJ = j;
                }
            }
        }

        matches.push({
            pairA: pool[bestI],
            pairB: pool[bestJ]
        });

        pool.splice(bestJ, 1);
        pool.splice(bestI, 1);
    }

    return matches.slice(0, courts);
};