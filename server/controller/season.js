import Season from '../models/Season.js';
import { computeRoundWindow } from '../helpers/dateHelpers.js';

// server/controller/season.js
// Solo 3 endpoints: createSeason, listSeasons, activateSeason. Nada más.
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

        const { name, year, type, roundIntervalDays, roundCloseTime, nextRoundCloseDate } = req.body;

        if (!name || !year || !type) {
            return res.status(400).json({ ok: false, message: 'name, year and type are required' });
        }

        const season = new Season({
            name, year, type,
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

/*
Suggested routes (server/routes/season.js):

router.post('/seasons', protect, requireAdmin, createSeason);
router.get('/seasons', protect, listSeasons);
router.patch('/seasons/:id/activate', protect, requireAdmin, activateSeason);
*/