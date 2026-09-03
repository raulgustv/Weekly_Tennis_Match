import admin from "../config/firebase.js";
import User from '../models/user.js'


export const notifyOtherPlayersOfJoin = async (userId, playerName, location, formattedDate) => {
  const usersNotice = await User.find({
    isActive: true,
    _id: { $ne: userId },
    fcmToken: { $exists: true, $ne: null }
  }).select("fcmToken");

  const tokens = usersNotice.map(u => u.fcmToken).filter(Boolean);

  if (tokens.length > 0) {
    await sendJoinMatchNotification(tokens, playerName, location, formattedDate);
  }
};

export const sendNotification = async (tokens, title, body, data) => {
    if (!tokens?.length) return;

    try {
        const message = {
            notification: {
                title,
                body
            },
            data: {
                ...data
            },
            tokens
        };

        const response = await admin.messaging().sendEachForMulticast(message);

        console.log(
            `Notifications: ${response.successCount} sent, ${response.failureCount} failed`
        );

        // log detallado de los que fallaron
        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.log(
                        `Failed token: ${tokens[idx]} | code: ${resp.error?.code} | message: ${resp.error?.message}`
                    );
                }
            });
        }

        return response;
    } catch (error) {
        console.log(error);
    }
};


export const sendNewMatchNotification = async (tokens, locationName, creator, formattedDate, formattedTime) => {
    //console.log(formattedDate, formattedTime)
    return sendNotification(
        tokens,
        "🎾 New Match Available",
        `${creator} has posted a new match on ${formattedDate} ${formattedTime}h at: ${locationName}`,
        {
            type: "NEW_MATCH"
        }
    );
};


export const sendJoinMatchNotification = async (tokens, playerName, locationName, formattedDate) => {
    try {
            return sendNotification(
            tokens,
            "🎾 New Player Joined",
            `${playerName} just joined match on ${formattedDate} at ${locationName}.`,
            {
                type: "PLAYER_JOINED"
            }
        );
    } catch (error) {
        console.log(error)
    }
};

// 🔵 CAMBIO: nueva — push que acompaña a sendAutoPromotedEmail cuando un
// backup pasa a player automáticamente.
export const sendAutoPromotedNotification = async (tokens, locationName, formattedDate) => {
    try {
        return sendNotification(
            tokens,
            "🎾 You're in the match!",
            `A spot opened up and you were auto-promoted to player for the match on ${formattedDate} at ${locationName}.`,
            {
                type: "AUTO_PROMOTED"
            }
        );
    } catch (error) {
        console.log(error);
    }
};

// 🔵 CAMBIO: nueva — push que acompaña a sendRemovedFromMatchEmail cuando
// un admin/booker retira a alguien manualmente.
export const sendRemovedFromMatchNotification = async (tokens, locationName, formattedDate) => {
    try {
        return sendNotification(
            tokens,
            "🎾 Removed from match",
            `You were removed from the match on ${formattedDate} at ${locationName} by an admin/booker.`,
            {
                type: "REMOVED_FROM_MATCH"
            }
        );
    } catch (error) {
        console.log(error);
    }
};

// CAMBIO (nuevo): aviso para el flujo pedido por Raúl — 10 minutos después de
// generar o editar los partidos automáticos (sin que se vuelva a tocar nada),
// se avisa SOLO a los jugadores confirmados de ESE partido (no a todos los
// usuarios de la app, a diferencia de sendNewMatchNotification). Quien decide
// cuándo llamar a esta función es el cron nuevo, server/jobs/matchNotifications.js.
export const sendMatchGeneratedNotification = async (tokens, locationName, formattedDate) => {
    try {
        return sendNotification(
            tokens,
            "🎾 Matches have been generated",
            `The pairings for your match on ${formattedDate} at ${locationName} are ready. Check who you're playing with!`,
            {
                type: "MATCH_GENERATED"
            }
        );
    } catch (error) {
        console.log(error)
    }
};