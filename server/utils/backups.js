// 🔵 CAMBIO: este fichero antes solo tenía inviteNextBackup() +
// generteInvitationToken() (el sistema de invitación por link de email,
// con accept/decline). Todo eso se ha eliminado. Ahora el fichero expone
// las piezas del nuevo flujo de auto-promote: promover al siguiente backup
// directamente, reembolsar su wallet retenido cuando aplique, y notificarlo.
import User from "../models/user.js";
import Match from "../models/Match.js";
import WalletTransaction from "../models/Wallet.js";
import { formatDate } from "../helpers/misc.js";
import {
  sendAutoPromotedEmail,
  sendRemovedFromMatchEmail
} from "./emailService.js";
import {
  sendAutoPromotedNotification,
  sendRemovedFromMatchNotification
} from "../services/notificationService.js";

/**
 * Promotes the next waiting backup (FIFO by joinedAt) into the players list.
 *
 * This mutates the given match document IN MEMORY only — the caller is
 * responsible for persisting it (match.save({ session })) inside their own
 * transaction, since this can be called from several flows (a player
 * leaving, an admin/booker removing a player, etc).
 *
 * The promoted backup keeps whatever payment method/amount they already
 * selected when they joined the backup list:
 *  - if they held funds in their wallet, that payment simply becomes "paid"
 *    for the player entry (no extra wallet movement needed, it was already
 *    deducted when they joined as backup)
 *  - otherwise it carries over as "unpaid", same as a normal unpaid join
 *
 * Returns { userId, payment } for the promoted user, or null if nobody
 * could be promoted (no backups waiting, or the match is already full).
 */
export const promoteNextBackup = (match) => {
  if (!match?.backUps?.length) return null;
  if (match.players.length >= match.maxPlayers) return null;

  const sorted = [...match.backUps].sort(
    (a, b) => new Date(a.joinedAt) - new Date(b.joinedAt)
  );

  const nextBackup = sorted[0];
  if (!nextBackup) return null;

  const backupUserId = nextBackup.user?._id
    ? nextBackup.user._id.toString()
    : nextBackup.user.toString();

  match.backUps = match.backUps.filter((b) => {
    const id = b.user?._id ? b.user._id.toString() : b.user.toString();
    return id !== backupUserId;
  });

  match.players.push({
    user: nextBackup.user?._id || nextBackup.user,
    joinedAt: new Date(),
    payment: {
      method: nextBackup.payment?.method,
      status: nextBackup.payment?.status === "held" ? "paid" : "unpaid",
      amount: nextBackup.payment?.amount
    }
  });

  if (match.players.length >= match.maxPlayers) {
    match.status = "Full";
  }

  return { userId: backupUserId, payment: nextBackup.payment };
};

/**
 * Refunds a backup's held wallet payment (only acts when payment.method
 * is "wallet" and payment.status is still "held" — safe to call even when
 * there is nothing to refund). Must run inside the caller's transaction
 * (pass the same session).
 */
export const refundBackupWallet = async ({ backup, userId, match, session, note }) => {
  if (!backup?.payment) return false;
  if (backup.payment.method !== "wallet") return false;
  if (backup.payment.status !== "held") return false;

  const amount = Number(backup.payment.amount) || 0;
  if (amount <= 0) return false;

  await User.findByIdAndUpdate(
    userId,
    { $inc: { walletBalance: amount } },
    { session }
  );

  await WalletTransaction.create(
    [{
      user: userId,
      amount,
      type: "refund",
      status: "confirmed",
      note: note || `Backup refund - match ${match._id}`,
      match: match._id
    }],
    { session }
  );

  return true;
};

/**
 * Best-effort notification (push + email) telling a user they were
 * automatically promoted from backup to player. Never throws — errors are
 * logged so they never roll back or block the flow that triggered them.
 */
export const notifyAutoPromoted = async (matchId, userId) => {
  try {
    // Deliberately re-fetched with no session: this always runs after the
    // triggering transaction has already committed (or as fire-and-forget),
    // so it must not depend on a session that may already be closed.
    const [user, match] = await Promise.all([
      User.findById(userId).select("email fcmToken"),
      Match.findById(matchId).populate("location", "name")
    ]);

    if (!user || !match) return;

    const formattedDate = formatDate(match.date);
    const locationName = match.location?.name || "";

    if (user.fcmToken) {
      await sendAutoPromotedNotification(
        [user.fcmToken],
        locationName,
        formattedDate
      );
    }

    if (user.email) {
      await sendAutoPromotedEmail(
        user.email,
        match,
        formattedDate
      );
    }
  } catch (error) {
    console.error("Error notifying auto-promoted user:", error);
  }
};

/**
 * Best-effort notification (push + email) telling a user an admin/booker
 * removed them from a match. Never throws.
 */
export const notifyRemovedByAdmin = async (matchId, userId) => {
  try {
    const [user, match] = await Promise.all([
      User.findById(userId).select("email fcmToken"),
      Match.findById(matchId).populate("location", "name")
    ]);

    if (!user || !match) return;

    const formattedDate = formatDate(match.date);
    const locationName = match.location?.name || "";

    if (user.fcmToken) {
      await sendRemovedFromMatchNotification(
        [user.fcmToken],
        locationName,
        formattedDate
      );
    }

    if (user.email) {
      await sendRemovedFromMatchEmail(
        user.email,
        match,
        formattedDate
      );
    }
  } catch (error) {
    console.error("Error notifying removed user:", error);
  }
};