import { Resend } from "resend";
import Match from "../models/Match.js";
import { formatDate } from "../helpers/misc.js";
import { generteInvitationToken } from "./backups.js";




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

export const sendMatchInviteEmail = async(to, matchId, userId) =>{

    try {
 

    const resend  = new Resend(process.env.RESEND_API_KEY)

    const match = await Match.findById(matchId).populate('location', 'name')
    const token = generteInvitationToken(matchId, userId)

    const acceptUrl = `${process.env.FRONTEND_URL}/match/details/${matchId}/accept?token=${token}`;
    const declineUrl =`${process.env.FRONTEND_URL}/match/details/${matchId}/decline?token=${token}`;

    const formattedDate = formatDate(match.date);

    await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to, 
        subject: "MTC Spot available",
        html: `
            <h2>Spot available for match on ${formattedDate} at ${match.location.name}</h2>

            <p>A spot is available for tenis on ${formattedDate} at ${match.location.name}</p>
            <p>
                You may join here: <a href='${acceptUrl}'>Accept spot</a>
            </p>
            <p>Or you may decline the invitation</p>
            <small>Declining this invitation will remove you from the queue</small>
            <p>
                <a href='${declineUrl}'>Decline spot</a>
            </p>
        `
    })

    console.log(`Email sent to ${to}`)
        
    } catch (error) {
        console.log(error)
    }
}

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