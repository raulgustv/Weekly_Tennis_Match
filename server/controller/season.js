import Season from '../models/Season.js';
// CHANGE (NUEVO): + buildMadridDateTime y dayjs (updateRoundCloseDate)
import { buildMadridDateTime, computeRoundWindow, dayjs } from '../helpers/dateHelpers.js';

// server/controller/season.js
// Endpoints: createSeason, listSeasons, activateSeason y (NUEVO) updateRoundCloseDate.
//
// startDate/endDate no se piden nunca por body — se calculan solos a
// partir de nextRoundCloseDate + roundCloseTime + roundIntervalDays
// (computeRoundWindow, en dateHelpers.js).
//
// Flujo real: crear la temporada CON nextRoundCloseDate puesto desde el
// principio (ej. "2026-09-13") → activarla. Ya.

const applyScheduleAndRecomputeWindow = (season, { roundCloseTime, roundIntervalDays, nextRoundCloseDate } = {}) => {
    if (roundCloseTime !== undefined) season.roundCloseTime = roundCloseTime;
    if (roundIntervalDays !== undefined) season.roundIntervalDays = roundIntervalDays;
    if (nextRoundCloseDate !== undefined) season.nextRoundCloseDate = nextRoundCloseDate;

    if (season.nextRoundCloseDate) {
        const { startDate, endDate } = computeRoundWindow(
            season.nextRoundCloseDate,
            season.roundCloseTime,
            season.roundIntervalDays
        );
        season.startDate = startDate;
        season.endDate = endDate;
    }
};

export const createSeason = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ ok: false, message: 'You are not authorized to create a season' });
        }

        const { name, year, type, roundIntervalDays, roundCloseTime, nextRoundCloseDate, registrationDeadline } = req.body;

        if (!name || !year || !type) {
            return res.status(400).json({ ok: false, message: 'name, year and type are required' });
        }

        const season = new Season({
            name, year, type, registrationDeadline,
            roundIntervalDays: roundIntervalDays || 14,
            roundCloseTime: roundCloseTime || '21:00',
            createdBy: req.user.id
        });

        applyScheduleAndRecomputeWindow(season, { nextRoundCloseDate });

        await season.save();

        return res.status(201).json({ ok: true, season });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ ok: false, message: 'A season with that year and type already exists' });
        }
        console.error(error);
        return res.status(500).json({ ok: false, message: 'Internal error creating the season' });
    }
};

export const listSeasons = async (req, res) => {
    try {
        const seasons = await Season.find().sort({ year: -1, createdAt: -1 });
        return res.status(200).json({ ok: true, seasons });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: 'Internal error listing seasons' });
    }
};

/**
 * Activa una temporada y cierra la que estuviera activa antes. No pide
 * nada en el body — usa el nextRoundCloseDate que ya se puso al crearla, y
 * solo recalcula startDate/endDate por si acaso. Si la temporada no tiene
 * nextRoundCloseDate (no se puso al crearla), la activación se rechaza en
 * vez de dejarla "activa pero muerta" para el cron.
 */
export const activateSeason = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ ok: false, message: 'You are not authorized to activate a season' });
        }

        const { id } = req.params;

        const season = await Season.findById(id);

        if (!season) {
            return res.status(404).json({ ok: false, message: 'Season not found' });
        }

        applyScheduleAndRecomputeWindow(season);

        if (!season.nextRoundCloseDate) {
            return res.status(400).json({
                ok: false,
                message: 'This season has no nextRoundCloseDate — set it when creating the season before activating it'
            });
        }

        const previousActive = await Season.findOne({ status: 'active', _id: { $ne: season._id } });
        if (previousActive) {
            previousActive.status = 'closed';
            await previousActive.save();
        }

        season.status = 'active';
        await season.save();

        return res.status(200).json({ ok: true, message: 'Season activated', season });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: 'Internal error activating the season' });
    }
};

// CHANGE (NUEVO): límites para mover el cierre de ronda
const MIN_MINUTES_AHEAD = 30;   // el nuevo cierre debe quedar al menos 30 min en el futuro
const MAX_DAYS_AHEAD = 90;      // y como mucho 90 días (evita errores de tecleo tipo 2062)

/**
 * CHANGE (NUEVO): PATCH /season/:id/round-close (solo admin)
 * Body: { nextRoundCloseDate: 'YYYY-MM-DD', roundCloseTime?: 'HH:mm' }
 *
 * Mueve el cierre de la ronda en juego (extender por lluvia, festivos, etc.
 * o adelantarlo). Solo temporada activa. El día se guarda normalizado a las
 * 00:00 UTC (como al crear la temporada); la hora real la pone roundCloseTime
 * en hora de Madrid (buildMadridDateTime), igual que lee el cron.
 *
 * Efectos: el cron cerrará en la nueva fecha; los recordatorios push se
 * recalculan solos (leen la misma fecha); las rondas siguientes mantienen el
 * ritmo de roundIntervalDays contando desde ESTA nueva fecha.
 */
export const updateRoundCloseDate = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ ok: false, message: 'You are not authorized to change the round close date' });
        }

        const { id } = req.params;
        const { nextRoundCloseDate, roundCloseTime } = req.body;

        const season = await Season.findById(id);

        if (!season) {
            return res.status(404).json({ ok: false, message: 'Season not found' });
        }

        if (season.status !== 'active') {
            return res.status(400).json({ ok: false, message: 'The round close date can only be changed for the active season' });
        }

        const newTime = roundCloseTime || season.roundCloseTime;
        const normalizedDate = new Date(`${nextRoundCloseDate}T00:00:00.000Z`);
        const closeMoment = buildMadridDateTime(normalizedDate, newTime);

        if (!closeMoment || !closeMoment.isValid()) {
            return res.status(400).json({ ok: false, message: 'Invalid close date or time' });
        }

        const now = dayjs();
        if (closeMoment.isBefore(now.add(MIN_MINUTES_AHEAD, 'minute'))) {
            return res.status(400).json({ ok: false, message: `The new close date must be at least ${MIN_MINUTES_AHEAD} minutes in the future` });
        }
        if (closeMoment.isAfter(now.add(MAX_DAYS_AHEAD, 'day'))) {
            return res.status(400).json({ ok: false, message: `The new close date cannot be more than ${MAX_DAYS_AHEAD} days away` });
        }

        const previousClose = buildMadridDateTime(season.nextRoundCloseDate, season.roundCloseTime);

        applyScheduleAndRecomputeWindow(season, { nextRoundCloseDate: normalizedDate, roundCloseTime: newTime });
        await season.save();

        console.log(
            `[season] Admin ${req.user._id} moved round close of "${season.name}": ` +
            `${previousClose ? previousClose.format('YYYY-MM-DD HH:mm') : 'none'} → ${closeMoment.format('YYYY-MM-DD HH:mm')} (Madrid)`
        );

        // Respuesta mínima: el front recarga con GET /ranking/rounds/:seasonId
        return res.status(200).json({
            ok: true,
            message: `Round close moved to ${closeMoment.format('ddd D MMM YYYY, HH:mm')} (Madrid time)`,
            nextRoundCloseDate: season.nextRoundCloseDate,
            roundCloseTime: season.roundCloseTime
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: 'Internal error changing the round close date' });
    }
};

/*
Suggested routes (server/routes/season.js):

router.post('/seasons', protect, requireAdmin, createSeason);
router.get('/seasons', protect, listSeasons);
router.patch('/seasons/:id/activate', protect, requireAdmin, activateSeason);
*/