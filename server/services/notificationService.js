import admin from "../config/firebase.js";
import User from '../models/user.js'


export const notifyOtherPlayersOfJoin = async (userId, playerName) => {
  const usersNotice = await User.find({
    isActive: true,
    _id: { $ne: userId },
    fcmToken: { $exists: true, $ne: null }
  }).select("fcmToken");

  const tokens = usersNotice.map(u => u.fcmToken).filter(Boolean);

  if (tokens.length > 0) {
    await sendJoinMatchNotification(tokens, playerName);
  }
};

export const sendNotification = async(tokens, title, body, data) =>{
    if(!tokens?.length) return;

    try {
        const message = {
            notification: {
                title,
                body
            },
            data,
            tokens
        }

        const response = await admin.messaging().sendEachForMulticast(message)

        console.log(
            `Notifications: ${response.successCount} sent, ${response.failureCount} failed`
        );

        return response;
    } catch (error) {
        console.log(error)
    }
}


export const sendNewMatchNotification = async (tokens, locationName) => {
    return sendNotification(
        tokens,
        "🎾 New Match Available",
        `A new match has been created at ${locationName}.`,
        {
            type: "NEW_MATCH"
        }
    );
};


export const sendJoinMatchNotification = async (tokens, playerName, locationName) => {
    return sendNotification(
        tokens,
        "🎾 New Player Joined",
        `${playerName} just joined your match at ${locationName}.`,
        {
            type: "PLAYER_JOINED"
        }
    );
};
