// NUEVO ARCHIVO: client/src/helpers/rankingSanctions.js
// Textos y reglas de las sanciones del ranking (Reglamento "Penalty system").
// Los valores de `value` son los mismos que acepta el backend (PENALTY_CATEGORIES
// en server/models/RankingPenalty.js). Todo el texto visible está en inglés.

export const NOTE_MAX = 500; // igual que el validator del servidor

export const PENALTY_CATEGORIES = [
    {
        value: "no_show",
        label: "No show",
        description: "The player did not show up to the match. The match counts as a loss.",
    },
    {
        value: "late_cancellation",
        label: "Late cancellation",
        description: "Cancellations must be communicated at least 24 hours before the match. Excessive (2 times) last-minute cancellations may result in a penalty point.",
    },
    {
        value: "rejecting_challenge",
        label: "Rejecting a challenge",
        description: "The player rejected a challenge. This does not apply to injuries.",
    },
    {
        value: "avoided_result_reporting",
        label: "Avoiding result reporting",
        description: "The player avoided reporting a result. Note: when nobody reports a result, closing the round already gives 1 point to both players, so do not repeat it here.",
    },
    {
        value: "verbal_abuse",
        label: "Verbal abuse",
        description: "Verbal abuse towards another player.",
    },
    {
        value: "aggressive_behaviour",
        label: "Aggressive behaviour",
        description: "Racket throwing or aggressiveness on court.",
    },
    {
        value: "cheating",
        label: "Cheating",
        description: "Cheating, such as reporting the last 3 points twice.",
    },
    {
        value: "other",
        label: "Other conduct",
        description: "Conduct not listed above that harms the operation or fairness of the ranking. Admins may assign penalty points for behaviours not explicitly listed.",
    },
];

// Escala del Reglamento (la suspensión es automática al llegar a cada tramo)
export const PENALTY_SCALE = [
    { points: 3, text: "2-round suspension" },
    { points: 4, text: "3-round suspension" },
    { points: 5, text: "Removed from the ranking this season (2-year suspension in the rules)" },
];

export const SERIOUS_CONDUCT_NOTE =
    "Racism, discrimination or harassment are not handled with penalty points: they result in immediate suspension. Use \"Remove from ranking\" for these cases.";

// Qué provoca el SIGUIENTE punto según los puntos actuales (null = nada)
export const getNextSanctionText = (points = 0) => {
    const next = points + 1;
    if (next >= 5) return "This point takes the player to 5 or more points: they will be removed from the ranking for this season.";
    if (next === 4) return "This point takes the player to 4 points: 3-round suspension.";
    if (next === 3) return "This point takes the player to 3 points: 2-round suspension.";
    return null;
};

// =====================================================================
// CHANGE (NUEVO): expulsión permanente del ranking (RankingRemoveModal)
// Mismos límites que removeFromRankingValidator en el servidor.
// =====================================================================
export const REMOVE_REASON_MIN = 10;
export const REMOVE_REASON_MAX = 300;

export const REMOVAL_WHEN_TO_USE =
    "Use it for serious or repeated misconduct, such as racism, discrimination, harassment, cheating or repeated aggressive behaviour or application misuse. For minor infractions, use penalty points instead.";

export const REMOVAL_EFFECTS = [
    "The player can never register for the MTC Ranking again.",
    "They disappear from the standings, the registered players list and all future rounds.",
    "Their unplayed matches in a published round are cancelled, so their opponents are not penalised.",
    "Their matches in a proposed (unpublished) round are deleted, and the opponent will appear without a pair.",
    "Matches already played keep their results and rating changes.",
    "The positions of the remaining players are recalculated.",
    "Their app account is not affected. To block the whole account, suspend it from the Players page.",
];