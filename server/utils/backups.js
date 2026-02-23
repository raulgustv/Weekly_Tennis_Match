import jwt from 'jsonwebtoken';
import {
    sendMatchInviteEmail
} from './emailService.js'
import User from "../models/user.js"; //;



export const inviteNextBackup = async (match) => {
  try {
    // 🔎 Find next waiting backup (FIFO by joinedAt)
    const nextBackup = match.backUps
      .filter(b => b.status === "waiting")
      .sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt))[0];

    if (!nextBackup) return;

    // 🔄 Change status to invited
    nextBackup.status = "invited";
    nextBackup.invitedAt = new Date();

    await match.save();

    // 🔐 Fetch real user from DB (NO populate dependency)
    const user = await User.findById(nextBackup.user).select("email");

    if (!user) {
      console.log("User not found when inviting backup");
      return;
    }

    await sendMatchInviteEmail(
      user.email,
      match._id,
      user._id
    );

  } catch (error) {
    console.error("Error inviting next backup:", error);
  }
};

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
