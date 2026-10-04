// [NUEVO ARCHIVO] src/helpers/rankingScoreRules.js
// Reglas de marcador del Reglamento, iguales que en
// server/validator/rankingValidator.js. En el front son SOLO para avisar
// antes de enviar; el servidor es quien valida de verdad.

// Set válido: 6-0 a 6-4, 7-5 o 7-6
export const isValidSetScore = (a, b) => {
    const high = Math.max(a, b);
    const low = Math.min(a, b);
    if (high === 6) return low <= 4;
    if (high === 7) return low === 5 || low === 6;
    return false;
};

// Súper tie break a 10 con diferencia de 2
export const isValidSuperTieBreak = (a, b) => {
    const high = Math.max(a, b);
    const low = Math.min(a, b);
    if (high < 10) return false;
    if (high === 10) return low <= 8;
    return high - low === 2;
};

/**
 * Evalúa un marcador de 2 sets (+ súper tie break si 1-1), con lados "a" y "b".
 * score = { s1a, s1b, s2a, s2b, stba, stbb }
 * Devuelve { error, needsStb, aWins, complete }.
 */
export const evaluateScore = (score) => {
    const { s1a, s1b, s2a, s2b, stba, stbb } = score;
    const isInt = Number.isInteger;

    if (![s1a, s1b, s2a, s2b].every(isInt)) return { error: null, needsStb: false, aWins: null, complete: false };
    if (!isValidSetScore(s1a, s1b)) return { error: `Set 1: ${s1a}-${s1b} is not a valid set score (valid: 6-0 to 6-4, 7-5 or 7-6)`, needsStb: false, aWins: null, complete: false };
    if (!isValidSetScore(s2a, s2b)) return { error: `Set 2: ${s2a}-${s2b} is not a valid set score (valid: 6-0 to 6-4, 7-5 or 7-6)`, needsStb: false, aWins: null, complete: false };

    const setsA = (s1a > s1b ? 1 : 0) + (s2a > s2b ? 1 : 0);
    if (setsA !== 1) return { error: null, needsStb: false, aWins: setsA === 2, complete: true };

    if (!isInt(stba) || !isInt(stbb)) return { error: null, needsStb: true, aWins: null, complete: false };
    if (!isValidSuperTieBreak(stba, stbb)) return { error: "Super tie break: first to 10, win by 2", needsStb: true, aWins: null, complete: false };
    return { error: null, needsStb: true, aWins: stba > stbb, complete: true };
};