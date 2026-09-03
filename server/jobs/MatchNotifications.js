// CAMBIO (archivo nuevo): cron que envía el push "Matches have been generated"
// 10 minutos después de generar o editar los partidos automáticos de un Match,
// siempre que en esos 10 minutos no se haya vuelto a generar/editar (ver
// generatedMatchesUpdatedAt / generatedMatchesNotifiedAt en models/Match.js, y
// el patch de generateMatches / updateGeneratedMatches en controller/match.js).
//
// Sigue el mismo patrón que jobs/matchStatus.js: node-cron cada minuto, en
// Europe/Madrid.
//
// Flujo pedido por Raúl:
//   1. admin/booker genera el partido automático (o lo edita)
//   2. si pasan 10 minutos sin que se vuelva a tocar, se avisa por push
//      SOLO a los jugadores confirmados de ESE partido (no a todos los
//      usuarios, a diferencia de sendNewMatchNotification)

import cron from 'node-cron';

import Match from '../models/Match.js';
import { sendMatchGeneratedNotification } from '../services/notificationService.js';

const MADRID_TIMEZONE = 'Europe/Madrid';
const NOTIFY_DELAY_MINUTES = 10;

cron.schedule(
  '* * * * *',
  async () => {
    try {
      const cutoff = new Date(Date.now() - NOTIFY_DELAY_MINUTES * 60 * 1000);

      // Partidos ya listos (generados), todavía sin avisar, cuya última
      // generación/edición fue hace 10 minutos o más.
      const pendingMatches = await Match.find({
        status: 'Ready',
        generatedMatchesNotifiedAt: null,
        generatedMatchesUpdatedAt: {
          $ne: null,
          $lte: cutoff
        }
      })
        .populate('location', 'name')
        .populate('players.user', 'fcmToken');

      for (const match of pendingMatches) {
        try {
          const tokens = match.players
            .map((p) => p.user?.fcmToken)
            .filter(Boolean);

          if (tokens.length > 0) {
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
              timeZone: MADRID_TIMEZONE
            })
              .format(match.date)
              .replace(',', '');

            await sendMatchGeneratedNotification(
              tokens,
              match.location?.name,
              formattedDate
            );

            console.log(
              `${match._id} → "Matches have been generated" enviado a ${tokens.length} jugador(es)`
            );
          } else {
            // Nadie con fcmToken en este partido: no hay nada que enviar,
            // pero igualmente se marca como notificado para no reintentar
            // en cada tick del cron.
            console.log(
              `${match._id} → sin fcmToken entre los jugadores confirmados, no se envía push`
            );
          }

          // Se marca como notificado tanto si había tokens como si no,
          // para no volver a evaluar este partido en el siguiente tick.
          match.generatedMatchesNotifiedAt = new Date();
          await match.save();
        } catch (matchError) {
          // Un fallo notificando un partido concreto no debe tumbar el resto
          // del cron ni bloquear los siguientes ticks.
          console.error(
            `Error enviando notificación de partidos generados para ${match._id}:`,
            matchError
          );
        }
      }
    } catch (error) {
      console.error('Cron error (matchNotifications):', error);
    }
  },
  {
    timezone: MADRID_TIMEZONE
  }
);