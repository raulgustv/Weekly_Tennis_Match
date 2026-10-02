// server/jobs/rankingReminders.js
//
// ARCHIVO NUEVO (todo el archivo es un cambio).
//
// Recordatorio push a los jugadores que tienen un partido de ranking
// PUBLICADO y todavía SIN RESULTADO ('scheduled'), antes de que cierre la ronda.
// Motivo: el Reglamento dice "Results must be submitted before the end of the
// round, no exceptions", y si no se envía resultado, closeRound penaliza con
// 1 punto a AMBOS jugadores. Avisar antes reduce penalizaciones injustas.
//
// Diseño:
// - Corre una vez por hora, en el minuto 0 (Europe/Madrid).
// - Para cada recordatorio (24 h y 3 h antes del cierre) comprueba si el cierre
//   cae dentro de la ventana (h-1, h] horas desde ahora. Como el cron corre cada
//   60 minutos y la ventana mide 60 minutos, cada recordatorio se envía EXACTAMENTE
//   una vez por ronda sin necesidad de guardar un flag en BD.
// - Contrapartida asumida: si el servidor está caído justo en esa hora, ese
//   recordatorio no se envía (no es crítico; la penalización la decide closeRound).
// - Solo push (reutiliza sendNotification de services/notificationService.js).
//   Texto en inglés, porque lo ve el usuario.
//
// Seguridad / privacidad:
// - No se loguean tokens FCM ni emails, solo contadores.
// - Solo se envía a los dos jugadores del partido, nunca a todos los usuarios.
// - Solo a usuarios activos (isActive: true) con fcmToken.

import cron from 'node-cron';

import Season from '../models/Season.js';
import RankingMatch from '../models/RankingMatch.js';
import User from '../models/user.js';
import { sendNotification } from '../services/notificationService.js';
import { MADRID_TIMEZONE, buildMadridDateTime, dayjs } from '../helpers/dateHelpers.js';

// Horas antes del cierre en las que se avisa.
const REMINDER_HOURS = [24, 3];

// FCM sendEachForMulticast admite como máximo 500 tokens por llamada.
const FCM_MULTICAST_LIMIT = 500;

let isRunning = false;

const chunk = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

/**
 * Devuelve qué recordatorio toca ahora (24 o 3) o null si ninguno.
 * Ventana: (h*60 - 60, h*60] minutos hasta el cierre.
 */
const getDueReminder = (now, closeMoment) => {
    const minutesLeft = closeMoment.diff(now, 'minute');

    for (const hours of REMINDER_HOURS) {
        const upper = hours * 60;
        const lower = upper - 60;
        if (minutesLeft > lower && minutesLeft <= upper) {
            return hours;
        }
    }
    return null;
};

const buildMessage = (hoursLeft, closeMoment) => {
    const closeText = `${closeMoment.format('ddd D MMM, HH:mm')} (Madrid time)`;

    const title = hoursLeft >= 24
        ? 'MTC Ranking: round closes tomorrow'
        : `MTC Ranking: round closes in ${hoursLeft} hours`;

    const body =
        `Please submit your match result before ${closeText}. ` +
        `Matches without a result give 1 penalty point to both players.`;

    return { title, body };
};

const processSeason = async (season, now) => {
    const closeMoment = buildMadridDateTime(season.nextRoundCloseDate, season.roundCloseTime);
    if (!closeMoment) return;

    const hoursLeft = getDueReminder(now, closeMoment);
    if (!hoursLeft) return;

    // Partidos publicados de esta temporada aún sin resultado.
    const pendingMatches = await RankingMatch.find({
        season: season._id,
        published: true,
        status: 'scheduled'
    }).select('playerA playerB');

    if (!pendingMatches.length) return;

    // Jugadores únicos (un jugador podría tener más de un partido pendiente).
    const playerIds = [
        ...new Set(pendingMatches.flatMap(m => [m.playerA.toString(), m.playerB.toString()]))
    ];

    const users = await User.find({
        _id: { $in: playerIds },
        isActive: true,
        fcmToken: { $exists: true, $ne: null }
    }).select('fcmToken');

    const tokens = [...new Set(users.map(u => u.fcmToken).filter(Boolean))];

    if (!tokens.length) {
        console.log(`[rankingReminders] Season "${season.name}": ${hoursLeft}h reminder — no players with push enabled.`);
        return;
    }

    const { title, body } = buildMessage(hoursLeft, closeMoment);

    // FCM exige que todos los valores de `data` sean strings.
    const data = {
        type: 'ranking_round_reminder',
        seasonId: season._id.toString(),
        hoursLeft: String(hoursLeft)
    };

    for (const tokenBatch of chunk(tokens, FCM_MULTICAST_LIMIT)) {
        await sendNotification(tokenBatch, title, body, data);
    }

    console.log(
        `[rankingReminders] Season "${season.name}": ${hoursLeft}h reminder sent for ${pendingMatches.length} pending match(es), ${tokens.length} device(s).`
    );
};

cron.schedule(
    '0 * * * *',
    async () => {
        if (isRunning) return;
        isRunning = true;

        try {
            const now = dayjs().tz(MADRID_TIMEZONE);

            const activeSeasons = await Season.find({
                status: 'active',
                nextRoundCloseDate: { $ne: null }
            });

            for (const season of activeSeasons) {
                try {
                    await processSeason(season, now);
                } catch (seasonError) {
                    console.error(`[rankingReminders] Error processing season ${season._id}:`, seasonError);
                }
            }
        } catch (error) {
            console.error('[rankingReminders] Cron error:', error);
        } finally {
            isRunning = false;
        }
    },
    {
        timezone: MADRID_TIMEZONE
    }
);