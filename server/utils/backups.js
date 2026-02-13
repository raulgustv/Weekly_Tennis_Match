import jwt from 'jsonwebtoken';
import {
    sendMatchInviteEmail
} from './emailService.js';

export const inviteNextBackup = async (match) => {

    const nextBackup = match.backUps
        .filter(b => b.status === 'waiting')
        .sort((a, b) => a.joinedAt - b.joinedAt)[0];

    if (!nextBackup) return;

    nextBackup.status = 'invited';

    nextBackup.invitedAt = new Date();

    await match.save();

    try {
        await sendMatchInviteEmail(
            nextBackup.user.email,
            match._id,
            nextBackup.user._id
        )
    } catch (error) {
        console.log(error)
    }
}


export const generteInvitationToken = (matchId, userId) => {
    return jwt.sign({
            matchId, 
            userId,
            type: 'MATCH_INVITE'
        },
        process.env.JWT_SECRET, {
            expiresIn: '4h'
        }
    )
}
