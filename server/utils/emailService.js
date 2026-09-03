import { Resend } from "resend";




export  const sendResetPasswordEmail = async(to, resetUrl) =>{

    const resend = new Resend(process.env.RESEND_API_KEY)

    console.log(to)

    await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to,
        subject: "Weekly tennis - Password reset",
        html:`
            <h2>Password reset</h2>
            <p>You have requested a linke to reset your password</p>
            <p>
                <a href="${resetUrl}">
                    Click here to reset your password
                </a>
            </p>
            <p>This link expires in 15 minutes</p>
        `
    })
}

// 🔵 CAMBIO: nuevo. Antes aquí estaba sendMatchInviteEmail() (mandaba el
// link de accept/decline). Se elimina porque el backup ya no necesita
// aceptar nada manualmente: en cuanto se libera una plaza se le promociona
// directo y solo se le avisa con este email.
export const sendAutoPromotedEmail = async (to, match, formattedDate) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const matchUrl = `${process.env.FRONTEND_URL}/match/details/${match._id}`;

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to,
            subject: "You've been added to the match",
            html: `
                <h2>You're in! You've been auto-promoted to player</h2>
                <p>A spot opened up on the match on ${formattedDate} at ${match?.location?.name || ""}, and you have been automatically moved from the backup list to the player list.</p>
                <p>Your previously selected payment method still applies. If you used your wallet, the funds you had on hold have now been used for your spot.</p>
                <p>
                    <a href="${matchUrl}">View match details</a>
                </p>
            `
        });

        console.log(`Auto-promoted email sent to ${to}`);
    } catch (error) {
        console.log(error);
    }
};

// 🔵 CAMBIO: nuevo. Se dispara cuando un admin/booker retira manualmente
// a un jugador o backup (server/controller/admin.js -> removePlayerMatch).
export const sendRemovedFromMatchEmail = async (to, match, formattedDate) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to,
            subject: "You've been removed from a match",
            html: `
                <h2>You were removed from a match</h2>
                <p>An administrator or booker has removed you from the match on ${formattedDate} at ${match?.location?.name || ""}.</p>
                <p>If you had a wallet payment on hold for this match, it has been refunded to your wallet balance.</p>
                <p>If you believe this was a mistake, please contact an administrator.</p>
            `
        });

        console.log(`Removed-from-match email sent to ${to}`);
    } catch (error) {
        console.log(error);
    }
};

export const sendVerificationEmail = async (to, name, code) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to,
            subject: "Welcome to MTC - Verify your account",
            html: `
                <h2>Welcome to MTC, ${name}!</h2>
                <p>Thanks for signing up. Please use the code below to verify your account:</p>
                <h1 style="letter-spacing: 4px;">${code}</h1>
                <p>This code expires in 15 minutes.</p>
                <p>If you didn't create this account, you can ignore this email.</p>
            `
        });
    } catch (error) {
        console.log(error);
    }
};