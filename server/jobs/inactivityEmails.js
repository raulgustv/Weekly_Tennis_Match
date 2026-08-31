import cron from 'node-cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import User from '../models/user.js';
import {
  sendInactivityEmail,
  sendInactivityEmailFinalWarning,
  sendAccountCloseEmail
} from '../utils/emailService.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const MADRID_TIMEZONE = 'Europe/Madrid';

/*
  ============================================================
  UMBRALES DE INACTIVIDAD
  ============================================================

  4 meses  -> primer recordatorio (podríamos cerrar la cuenta)
  6 meses  -> último aviso (la próxima vez cerraremos la cuenta)
  12 meses -> cierre de cuenta (isActive: false) + despedida

  La referencia para contar los meses es lastMatchPlayed. Si el
  usuario nunca ha jugado un partido, se usa su fecha de registro
  (createdAt).
*/
const FIRST_WARNING_MONTHS = 4;
const FINAL_WARNING_MONTHS = 6;
const CLOSE_ACCOUNT_MONTHS = 12;

// Orden de progresión. Solo se avanza hacia adelante en cada
// ejecución; si el usuario vuelve a jugar, se resetea a "none".
const STAGE_ORDER = {
  none: 0,
  first_warning: 1,
  final_warning: 2,
  closed: 3
};

/*
  No se registran emails completos en los logs del cron
  (buena práctica de privacidad/seguridad para no volcar PII
  en logs de servidor/proveedor de hosting).
*/
const maskEmail = (email = '') => {
  const [user, domain] = String(email).split('@');
  if (!user || !domain) return '***';
  const visible = user.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(user.length - 1, 1))}@${domain}`;
};

const getTargetStage = (monthsInactive) => {
  if (monthsInactive >= CLOSE_ACCOUNT_MONTHS) return 'closed';
  if (monthsInactive >= FINAL_WARNING_MONTHS) return 'final_warning';
  if (monthsInactive >= FIRST_WARNING_MONTHS) return 'first_warning';
  return 'none';
};

/*
  ============================================================
  CRON
  ============================================================

  Se ejecuta una vez al día, de madrugada (03:00 Europe/Madrid).
  No necesita más frecuencia: los umbrales son de meses, así que
  precisión de un día es más que suficiente y evita golpear la
  base de datos y el proveedor de email sin necesidad.
*/
cron.schedule(
  '0 3 * * *',
  async () => {
    const now = dayjs().tz(MADRID_TIMEZONE);

    console.log('Inactivity cron running at:', now.format('YYYY-MM-DD HH:mm:ss Z'));

    let usersChecked = 0;
    let usersAdvanced = 0;
    let usersReset = 0;
    let usersClosed = 0;

    try {
      // Solo cuentas activas: una cuenta ya cerrada (isActive: false)
      // no vuelve a tocarse desde aquí.
      const activeUsers = await User.find({ isActive: true }).select(
        'name email lastMatchPlayed createdAt inactivityStage'
      );

      for (const user of activeUsers) {
        usersChecked += 1;

        try {
          const referenceDate = user.lastMatchPlayed || user.createdAt;

          // Sin fecha de referencia (no debería pasar, createdAt es
          // automático) no podemos calcular nada: se ignora el usuario.
          if (!referenceDate) continue;

          const monthsInactive = now.diff(dayjs(referenceDate), 'month');
          const currentStage = user.inactivityStage || 'none';
          const targetStage = getTargetStage(monthsInactive);

          if (targetStage === currentStage) {
            // Ya está en el estado correcto, nada que hacer.
            continue;
          }

          if (STAGE_ORDER[targetStage] < STAGE_ORDER[currentStage]) {
            // El usuario volvió a jugar (o su referencia mejoró) y ya
            // no le corresponde ningún aviso: se resetea en silencio,
            // sin enviar ningún email.
            await User.findByIdAndUpdate(user._id, {
              $set: {
                inactivityStage: 'none',
                lastInactivityMailSentAt: null
              }
            });

            usersReset += 1;
            console.log(`${maskEmail(user.email)} -> inactivityStage reset (volvió a jugar)`);
            continue;
          }

          // Avanza de stage: envía el email correspondiente al nuevo
          // estado. Si el cron estuvo parado varios meses y el usuario
          // "salta" varios umbrales de golpe, se envía solo el email
          // del estado final (el más relevante), nunca varios a la vez.
          const update = {
            inactivityStage: targetStage,
            lastInactivityMailSentAt: now.toDate()
          };

          if (targetStage === 'first_warning') {
            await sendInactivityEmail(user.email, user.name);
          } else if (targetStage === 'final_warning') {
            await sendInactivityFinalWarningEmail(user.email, user.name);
          } else if (targetStage === 'closed') {
            update.isActive = false;
            await sendAccountCloseEmail(user.email, user.name);
            usersClosed += 1;
          }

          await User.findByIdAndUpdate(user._id, { $set: update });

          usersAdvanced += 1;
          console.log(`${maskEmail(user.email)} -> ${currentStage} => ${targetStage}`);
        } catch (userError) {
          // Un fallo con un usuario concreto no debe interrumpir el
          // resto del lote.
          console.error(`Inactivity cron error for ${maskEmail(user.email)}:`, userError);
        }
      }

      console.log(
        `Inactivity cron done. checked=${usersChecked} advanced=${usersAdvanced} reset=${usersReset} closed=${usersClosed}`
      );
    } catch (error) {
      console.error('Inactivity cron error:', error);
    }
  },
  {
    timezone: MADRID_TIMEZONE
  }
);