import { body, param, query } from 'express-validator'; // CHANGE: añadido `query` (roundOverviewValidator) // CHANGE (NUEVO): + `param` (adminResultValidator)

// server/validator/rankingValidator.js
// Mismo estilo que server/validator/userValidator.js. Mensajes en inglés,
// porque todo lo que ve el usuario final debe estar en inglés.

export const registerForRankingValidator = [
    // CHANGE: .isBoolean({ strict: true }) — antes "true" (string) o 1 pasaban
    // el isBoolean() y luego fallaban en el controller con un mensaje distinto.
    body('acceptRankingRules')
        .isBoolean({ strict: true }).withMessage('You must accept the MTC Ranking rules to register')
        .custom(value => value === true)
        .withMessage('You must accept the MTC Ranking rules to register'),

    // CHANGE: NUEVO — antes dateOfBirth llegaba al controller sin validar
    // (cualquier string). Ahora: opcional (solo se pide si el usuario aún no
    // la tiene guardada), formato YYYY-MM-DD estricto, no futura y no absurda.
    // El 18+ lo sigue comprobando el controller con isAtLeast18 (fuente única).
    body('dateOfBirth')
        .optional({ values: 'null' })
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage('Invalid date of birth')
        .bail()
        .custom((value) => {
            const dob = new Date(value);
            if (Number.isNaN(dob.getTime())) throw new Error('Invalid date of birth');
            if (dob > new Date()) throw new Error('Date of birth cannot be in the future');
            if (dob.getFullYear() < 1900) throw new Error('Invalid date of birth');
            return true;
        })
];

// CHANGE (NUEVO): reglas de marcador del Reglamento (formato estricto).
// Un set es válido si el ganador tiene 6 y el perdedor 0-4, o 7-5, o 7-6 (tie break).
const isValidSetScore = (a, b) => {
    const high = Math.max(a, b);
    const low = Math.min(a, b);
    if (high === 6) return low <= 4;
    if (high === 7) return low === 5 || low === 6;
    return false;
};

// CHANGE (NUEVO): súper tie break a 10 con diferencia de 2.
// Si el ganador llega a 10, el perdedor tiene como mucho 8; si pasa de 10, gana por 2 exactos.
const isValidSuperTieBreak = (a, b) => {
    const high = Math.max(a, b);
    const low = Math.min(a, b);
    if (high < 10) return false;
    if (high === 10) return low <= 8;
    return high - low === 2;
};

export const submitRankingResultValidator = [
    body('matchId')
        .notEmpty().withMessage('Match id is required')
        .isMongoId().withMessage('Invalid match id'),

    // CHANGE: antes isArray({ min: 1, max: 3 }) — se aceptaba un solo set o un 3er set
    // completo. Formato del Reglamento: al mejor de 2 sets (el 3º, si hace falta,
    // es un súper tie break y va en `superTieBreak`, no en `sets`).
    body('sets')
        .isArray({ min: 2, max: 2 })
        .withMessage('A result must have exactly 2 sets (best of 2 sets; a 1-1 tie is decided by a super tie break)'),

    // CHANGE: antes solo validaba sets[0] (setScoreValidator(0), llamado
    // una sola vez) — si mandabas 2 o 3 sets, el resto pasaba sin
    // validar. Con wildcard valida cada set que venga en el array.
    // CHANGE: añadido .toInt() — el controller compara números, no strings
    body('sets.*.gamesA')
        .notEmpty().withMessage('Games for player A are required in every set')
        .isInt({ min: 0, max: 7 }).withMessage('Invalid game count for player A')
        .toInt(),

    body('sets.*.gamesB')
        .notEmpty().withMessage('Games for player B are required in every set')
        .isInt({ min: 0, max: 7 }).withMessage('Invalid game count for player B')
        .toInt(),

    // CHANGE: antes solo comprobaba que un set no terminara en empate; se aceptaban
    // marcadores imposibles (7-0, 6-5, 7-7...). Ahora cada set debe ser un marcador real.
    body('sets')
        .custom((sets) => {
            if (!Array.isArray(sets)) return true; // ya lo cubre el .isArray() de arriba
            sets.forEach((set, i) => {
                const a = Number(set?.gamesA);
                const b = Number(set?.gamesB);
                if (!Number.isInteger(a) || !Number.isInteger(b)) return; // lo cubren los wildcard
                if (!isValidSetScore(a, b)) {
                    throw new Error(`Set ${i + 1}: ${a}-${b} is not a valid set score (valid: 6-0 to 6-4, 7-5 or 7-6)`);
                }
            });
            return true;
        }),

    body('superTieBreak.played')
        .optional()
        .isBoolean({ strict: true }).withMessage('superTieBreak.played must be a boolean'),

    body('superTieBreak.pointsA')
        .optional({ nullable: true })
        .isInt({ min: 0, max: 99 }).withMessage('Invalid super tie break score for player A'),

    body('superTieBreak.pointsB')
        .optional({ nullable: true })
        .isInt({ min: 0, max: 99 }).withMessage('Invalid super tie break score for player B'),

    // CHANGE (NUEVO): con 1-1 en sets el súper tie break es obligatorio y válido;
    // con 2-0 no se puede enviar súper tie break.
    body('superTieBreak')
        .custom((stb, { req }) => {
            const sets = req.body?.sets;
            if (!Array.isArray(sets) || sets.length !== 2) return true; // ya lo cubre `sets`

            const setsWonByA = sets.filter(s => Number(s?.gamesA) > Number(s?.gamesB)).length;
            const tied = setsWonByA === 1;

            if (!tied) {
                if (stb?.played === true) {
                    throw new Error('A super tie break is only played when the sets are tied 1-1');
                }
                return true;
            }

            const a = Number(stb?.pointsA);
            const b = Number(stb?.pointsB);
            if (stb?.played !== true || !Number.isInteger(a) || !Number.isInteger(b) || !isValidSuperTieBreak(a, b)) {
                throw new Error('The sets are tied 1-1: please add a valid super tie break score (first to 10, win by 2)');
            }
            return true;
        })
];

export const disputeRankingResultValidator = [
    body('matchId')
        .notEmpty().withMessage('Match id is required')
        .isMongoId().withMessage('Invalid match id'),
    body('reason')
        .trim()
        .notEmpty().withMessage('A reason is required to dispute a result')
        .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
];

// =====================================================================
// CHANGE (NUEVO): validadores del flujo admin de rondas
// =====================================================================

const seasonIdInBody = () =>
    body('seasonId')
        .notEmpty().withMessage('Season id is required')
        .bail()
        .isMongoId().withMessage('Invalid season id');

// POST /ranking/rounds/propose — el número de ronda lo calcula el servidor
export const proposeRoundValidator = [
    seasonIdInBody()
];

// POST /ranking/rounds/publish y /ranking/rounds/discard
export const roundActionValidator = [
    seasonIdInBody(),
    body('round')
        .notEmpty().withMessage('Round is required')
        .bail()
        .isInt({ min: 1 }).withMessage('Invalid round number')
        .toInt()
];

// GET /ranking/rounds/:seasonId?round=N (el :seasonId lo valida validateObjectId)
export const roundOverviewValidator = [
    query('round')
        .optional()
        .isInt({ min: 1 }).withMessage('Invalid round number')
        .toInt()
];
// CHANGE (NUEVO): PUT /ranking/matches/:id/result (solo admin)
// Mismas reglas de marcador que el jugador (se reutilizan las cadenas de
// submitRankingResultValidator sin la de matchId, que aquí va en la URL)
// + motivo obligatorio, que queda guardado en el partido como auditoría.
export const adminResultValidator = [
    param('id').isMongoId().withMessage('Invalid match id'),
    ...submitRankingResultValidator.slice(1),
    body('reason')
        .isString().withMessage('A reason is required')
        .bail()
        .trim()
        .notEmpty().withMessage('Please explain why you are setting or changing this result')
        .isLength({ max: 300 }).withMessage('Reason cannot exceed 300 characters')
];