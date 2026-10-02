import cron from 'node-cron';

import Season from '../models/Season.js';
// CHANGE (CRÍTICO): antes '../services/rankingService.js' — ese archivo NO existe (es rankingServices.js).
// En ESM un import roto tumba todo el servidor al arrancar.
import { closeRound } from '../services/rankingServices.js';
import { MADRID_TIMEZONE, buildMadridDateTime, dayjs } from '../helpers/dateHelpers.js';

// server/jobs/rankingRound.js
// NUEVO. Sigue el mismo patrón que server/jobs/matchStatus.js: cron cada
// minuto, comparando "ahora en Europe/Madrid" contra una fecha/hora
// construida con dayjs.tz — así el domingo 21:00 es siempre 21:00 hora de
// Madrid, cambie o no el horario de verano entre medias.
//
// Import a controller/ranking.js: closeRound ya hace todo el trabajo
// (marca partidos sin resultado como disputados + penalización, propone la
// siguiente ronda, avanza nextRoundCloseDate). Este archivo solo decide
// CUÁNDO llamarlo.
//
// Recuerda registrar este archivo igual que registras matchStatus.js
// (normalmente un simple `import './jobs/rankingRound.js'` en server.js).

cron.schedule(
    '* * * * *',
    async () => {
        try {
            const now = dayjs().tz(MADRID_TIMEZONE);

            // Solo nos interesan las temporadas activas con una fecha de
            // cierre configurada — una temporada 'upcoming' o sin
            // nextRoundCloseDate todavía no dispara nada.
            const activeSeasons = await Season.find({
                status: 'active',
                nextRoundCloseDate: { $ne: null }
            });

            for (const season of activeSeasons) {
                const closeMoment = buildMadridDateTime(season.nextRoundCloseDate, season.roundCloseTime);

                if (!closeMoment) continue;

                if (now.isSame(closeMoment) || now.isAfter(closeMoment)) {
                    console.log(
                        `[rankingRound] Cerrando ronda de la temporada ${season.name} (cierre programado: ${closeMoment.format('YYYY-MM-DD HH:mm')} Madrid)`
                    );

                    const result = await closeRound({ seasonId: season._id });

                    console.log(
                        `[rankingRound] Ronda cerrada — ${result.disputedCount} partido(s) sin resultado marcados como disputados. Siguiente ronda propuesta (sin publicar).`
                    );
                }
            }
        } catch (error) {
            console.error('[rankingRound] Cron error:', error);
        }
    },
    {
        timezone: MADRID_TIMEZONE
    }
);