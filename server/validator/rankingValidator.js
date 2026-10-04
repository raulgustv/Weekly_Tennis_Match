import { body, query } from 'express-validator'; // CHANGE: añadido `query` (roundOverviewValidator)

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

export const submitRankingResultValidator = [
    body('matchId')
        .notEmpty().withMessage('Match id is required')
        .isMongoId().withMessage('Invalid match id'),

    body('sets')
        .isArray({ min: 1, max: 3 })
        .withMessage('A result needs between 1 and 3 sets (best of 2, or 3 with a super tie break)'),

    // CHANGE: antes solo validaba sets[0] (setScoreValidator(0), llamado
    // una sola vez) — si mandabas 2 o 3 sets, el resto pasaba sin
    // validar. Con wildcard valida cada set que venga en el array.
    body('sets.*.gamesA')
        .notEmpty().withMessage('Games for player A are required in every set')
        .isInt({ min: 0, max: 7 }).withMessage('Invalid game count for player A'),

    body('sets.*.gamesB')
        .notEmpty().withMessage('Games for player B are required in every set')
        .isInt({ min: 0, max: 7 }).withMessage('Invalid game count for player B'),

    // CHANGE: nuevo — un set no puede terminar en empate de games.
    body('sets')
        .custom((sets) => {
            if (!Array.isArray(sets)) return true; // ya lo cubre el .isArray() de arriba
            for (const set of sets) {
                if (Number(set.gamesA) === Number(set.gamesB)) {
                    throw new Error('A set cannot end in a tie');
                }
            }
            return true;
        }),

    body('superTieBreak.played')
        .optional()
        .isBoolean().withMessage('superTieBreak.played must be a boolean'),

    body('superTieBreak.pointsA')
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage('Invalid super tie break score for player A'),

    body('superTieBreak.pointsB')
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage('Invalid super tie break score for player B')
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