import cron from 'node-cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import Match from '../models/Match.js';
import User from '../models/user.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const MADRID_TIMEZONE = 'Europe/Madrid';

/*
  ============================================================
  CRON
  ============================================================

  Se ejecuta cada minuto.

  timezone: Europe/Madrid hace que node-cron interprete
  la programación utilizando la hora de Madrid.
*/
cron.schedule(
  '* * * * *',
  async () => {
    try {
      const now = dayjs().tz(MADRID_TIMEZONE);

      console.log(
        'Cron running at:',
        now.format('YYYY-MM-DD HH:mm:ss Z')
      );

      /*
        ==========================================
        OPEN → CLOSED
        ==========================================
      */

      const openMatches = await Match.find({
        status: 'Open',
      });

      for (const match of openMatches) {
        if (!match.date || !match.startTime) continue;

        /*
          Construimos explícitamente la fecha/hora
          del partido en Europe/Madrid.

          Ejemplo:
          date      = 2026-08-24
          startTime = 18:30

          → 2026-08-24 18:30 Europe/Madrid
        */

        const startDate = buildMadridDate(
          match.date,
          match.startTime
        );

        if (!startDate) continue;

        if (now.isSame(startDate) || now.isAfter(startDate)) {
          match.status = 'Closed';

          await match.save();

          console.log(
            `${match._id} → Closed (from Open)`
          );
        }
      }

      /*
        ==========================================
        READY → PLAYING
        ==========================================
      */

      const readyMatches = await Match.find({
        status: 'Ready',
      });

      for (const match of readyMatches) {
        if (!match.date || !match.startTime) continue;

        const startDate = buildMadridDate(
          match.date,
          match.startTime
        );

        if (!startDate) continue;

        if (now.isSame(startDate) || now.isAfter(startDate)) {
          match.status = 'Playing';

          await match.save();

          console.log(
            `${match._id} → Playing`
          );
        }
      }

      /*
        ==========================================
        PLAYING → PLAYED
        ==========================================
      */

      const playingMatches = await Match.find({
        status: 'Playing',
      });

      for (const match of playingMatches) {
        if (!match.date || !match.endTime) continue;

        const endDate = buildMadridDate(
          match.date,
          match.endTime
        );

        if (!endDate) continue;

        if (now.isSame(endDate) || now.isAfter(endDate)) {
          match.status = 'Played';
          match.wasPlayed = true;

          await match.save();

          /*
            Actualizar lastMatchPlayed
            de los jugadores del partido.
          */

          const lastMatchPlayed = endDate.toDate();

          const userIds = match.players
                            .map((player) => player.user)
                            .filter(Boolean)

          

         await User.updateMany(
                  {
                    _id: {
                      $in: userIds,
                    },

                    $or: [
                      {
                        lastMatchPlayed: {
                          $exists: false,
                        },
                      },
                      {
                        lastMatchPlayed: {
                          $lt: lastMatchPlayed,
                        },
                      },
                    ],
                  },
                  {
                    $set: {
                      lastMatchPlayed,
                    },
                  }
                );

        console.log(
          `${match._id} → Played | ${userIds.length} usuarios actualizados`
        );
    
        }
      }

      /*
        ==========================================
        PLAYED → CLOSED
        48 HORAS DESPUÉS
        ==========================================
      */

      const playedMatches = await Match.find({
        status: 'Played',
      });

      for (const match of playedMatches) {
        if (!match.date || !match.endTime) continue;

        const endDate = buildMadridDate(
          match.date,
          match.endTime
        );

        if (!endDate) continue;

        /*
          Añadimos exactamente 48 horas
          desde el final del partido.
        */

        const closeDate = endDate.add(
          48,
          'hour'
        );

        if (
          now.isSame(closeDate) ||
          now.isAfter(closeDate)
        ) {
          match.status = 'Closed';

          await match.save();

          console.log(
            `${match._id} → Closed`
          );
        }
      }
    } catch (error) {
      console.error(
        'Cron error:',
        error
      );
    }
  },
  {
    timezone: MADRID_TIMEZONE,
  }
);


/*
  ============================================================
  HELPER
  ============================================================

  Recibe:

  date      → fecha del partido
  time      → HH:mm

  Y devuelve un objeto Dayjs situado explícitamente
  en Europe/Madrid.
*/

function buildMadridDate(date, time) {
  if (!date || !time) {
    return null;
  }

  /*
    Si match.date viene de MongoDB como Date,
    primero obtenemos la fecha calendario que representa.

    Usamos UTC aquí para evitar que la zona horaria
    del servidor cambie el día.
  */

  const dateString = dayjs(date)
    .utc()
    .format('YYYY-MM-DD');

  const [hours, minutes] = time
    .split(':')
    .map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    console.error(
      'Invalid match time:',
      time
    );

    return null;
  }

  return dayjs.tz(
    `${dateString} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    'YYYY-MM-DD HH:mm',
    MADRID_TIMEZONE
  );
}