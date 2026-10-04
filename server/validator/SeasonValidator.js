import { body } from 'express-validator';

// [NUEVO ARCHIVO] server/validator/seasonValidator.js
// Validadores de temporada. Mensajes en inglés (los ve el usuario).

// PATCH /season/:id/round-close — el admin cambia el cierre de la ronda actual
// (lluvia, festivos...). Solo se manda el DÍA (YYYY-MM-DD) y, opcionalmente,
// la hora HH:mm (hora de Madrid). El controller comprueba que el momento
// resultante sea futuro y no esté demasiado lejos.
export const roundCloseDateValidator = [
    body('nextRoundCloseDate')
        .notEmpty().withMessage('The new close date is required')
        .bail()
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Invalid close date (expected YYYY-MM-DD)')
        .bail()
        .isISO8601({ strict: true, strictSeparator: true }).withMessage('Invalid close date'),

    body('roundCloseTime')
        .optional()
        .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Invalid close time (expected HH:mm, 24h)')
];