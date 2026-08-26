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
