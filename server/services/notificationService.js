import admin from "../config/firebase.js";

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
