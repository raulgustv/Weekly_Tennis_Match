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


/*
  ============================================================
  INACTIVITY EMAILS (jobs/inactivityCheck.js)
  ============================================================
 */
const REPLY_TO_EMAIL = process.env.SUPPORT_EMAIL;

export const sendInactivityEmail = async(to, name) =>{
    try {

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to,
            replyTo: REPLY_TO_EMAIL,
            subject: '[MTC] Weekly tennis - We miss you on the court',
            html: `
                <h2>Hi ${name},</h2>

                <p>It's been a while since you've joined a Weekly Tennis match.</p>

                <p>Why not sign up for a match this week? If your account remains
                inactive, we may eventually have to close it.</p>

                <p>
                    If there's a match available you will see it here:
                    <a href="${process.env.FRONTEND_URL}/games">View available matches</a>
                </p>

                <p>If you believe this is a mistake, simply reply to this email.</p>`
        });

        console.log('First warning inactivity email sent')
        
    } catch (error) {
        console.log(error)
    }
}


export const sendInactivityEmailFinalWarning = async(to, name) =>{
    try {

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to,
            replyTo: REPLY_TO_EMAIL,
            subject: '[MTC] Weekly tennis - Last warning before your account is closed',
            html: `
                <h2>Hi ${name},</h2>

                <p>This is our last reminder to join for you to join us playing a match:</p>

                <p>
                    We'd like to see you around in our group, so we invite you to join us on future matches. Unfortunately
                    if your account still shows inactivity we will have to close it. You will still remain in our Whatsapp 
                    group if you wish. 
                </p>

                <p>
                    Matches available, are here:
                    <a href="${process.env.FRONTEND_URL}/games">View available matches</a>
                </p>

                <p>If you believe this is a mistake, simply reply to this email.</p>`
        });

        console.log('Second and final warning inactivity email sent')
        
    } catch (error) {
        console.log(error)
    }
}

export const sendAccountCloseEmail = async(to, name) =>{
    try {

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to,
            replyTo: REPLY_TO_EMAIL,
            subject: '[MTC] Weekly tennis - Your account has been closed',
            html: `
                <h2>Hi ${name},</h2>

                <p>It's been a while since we've seen you on court, so we have decided to close your account</p>

                <p>
                    If you believe this is a mistake, or you want to have your account re-activated please reply to this email
                    and we will review your case
                </p>
                
                <p>Thanks for having been a part of the Madrid tennis community</p>
                `

        });

        console.log('Account close email sent')
        
    } catch (error) {
        console.log(error)
    }
}