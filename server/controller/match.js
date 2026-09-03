import Match from '../models/Match.js';
import Location from '../models/Location.js';
import User from "../models/user.js";
import WalletTransaction from "../models/Wallet.js";
import {
    averageNTRP,
    generateBalancedMatches,
    generateCompetitivePairs,
    //rotatePlayers,
    shuffleArray
} from '../utils/createPairs.js';
import {
    isLessThan24h
} from '../helpers/misc.js';
import {
    promoteNextBackup,
    refundBackupWallet,
    notifyAutoPromoted
} from '../utils/backups.js';
import mongoose from 'mongoose';
import { notifyOtherPlayersOfJoin, sendNewMatchNotification, sendNotification } from '../services/notificationService.js';



export const newMatch = async (req, res) => {
    try {
        const {
            locationSlug,
            date,
            startTime,
            endTime,
            courts,
            paymentMethods
        } = req.body;

        const location = await Location.findOne({
            slug: locationSlug,
            active: true
        });

        if (!location) {
            return res.status(404).json({
                ok: false,
                message: 'Location not found or unavailable'
            });
        }

        const courtNumbersParsed = courts.map(c => Number(c.courtNumber));        

        const activeCourts = location.courts
            .filter(c => c.active !== false)
            .map(c => c.number);
            

        const validSelection = courtNumbersParsed.every(c =>
            activeCourts.includes(c)
        );

        if (!validSelection) {
            return res.status(400).json({
                ok: false,
                message: 'Invalid court selection'
            });
        }

        const totalPrice = Math.ceil(
          courts.reduce((sum, c) => sum + Number(c.price), 0) * 10
        ) / 10;

        const maxPlayers = courtNumbersParsed.length * 4;

        /* Wallet siempre presente*/
        const finalPaymentMethods = paymentMethods?.length
          ? [...paymentMethods]
          : [];

        const hasWallet = finalPaymentMethods.some(pm => pm.type === "wallet");

        if (!hasWallet) {
          finalPaymentMethods.push({
            type: "wallet",
            value: "NA"
          });
        }

        const pricePerPlayer = Math.round((totalPrice / maxPlayers) * 100) / 100;

        // 🔵 CAMBIO: antes el creador del partido NO quedaba registrado
        // como jugador (tenía que hacer join él mismo después). Ahora se
        // añade directamente en el array "players" del create(), con
        // payment.status = "paid" (pedido explícito: el booker no debe
        // figurar como "unpaid" en su propio partido).
        const match = await Match.create({
            createdBy: req.user._id,
            location: location._id,
            courts,
            date,
            startTime,
            endTime,
            price: totalPrice,
            maxPlayers,
            paymentMethods: finalPaymentMethods,
            players: [{
                user: req.user._id,
                joinedAt: new Date(),
                payment: {
                    method: "booker",
                    status: "paid",
                    amount: pricePerPlayer
                }
            }],
            status: maxPlayers <= 1 ? "Full" : "Open"
        });

        /* PUSH NOTIFICATION */ 
        
        const creator = await User.findById(req.user._id).select("name lastname");

        const formattedDate = new Intl.DateTimeFormat('en-US', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'long',
                                  timeZone: 'Europe/Madrid'
                                }).format(new Date(`${date}T00:00:00`))
                                  .replace(',', ''); // saca la coma que agrega el locale es-ES        
        const usersNotice = await User.find({
          isActive: true,
          _id: { $ne: req.user._id },
          fcmToken: {
            $exists: true,
            $ne: null
          }
        }).select("fcmToken");

        const tokens = usersNotice
          .map(user => user.fcmToken)
          .filter(Boolean);

        await sendNewMatchNotification(tokens, location.name, `${creator.name} ${creator.lastname}`, formattedDate, startTime);

        return res.status(201).json(match);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Internal error creating match'
        });
    }
};

export const getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('location', 'name address courts')
            .populate('players.user', 'name lastname ntrplvl profilePicture')
            .populate('backUps.user', 'name lastname ntrplvl profilePicture')
            .populate('createdBy', 'name lastname walletPaymentAllowed')
            .populate('generatedMatches.teamA.player1', 'name lastname ntrplvl profilePicture')
            .populate('generatedMatches.teamA.player2', 'name lastname ntrplvl profilePicture')
            .populate('generatedMatches.teamB.player1', 'name lastname ntrplvl profilePicture')
            .populate('generatedMatches.teamB.player2', 'name lastname ntrplvl profilePicture')
            .lean();

           const matchesWithSurface = matches.map(match => {

            const courts = match.courts.map(court => {

                const locationCourt = match.location.courts.find(
                    lc => lc.number === court.courtNumber
                );

                return {
                    ...court,
                    surface: locationCourt?.surface || null
                };
            });

            return {
                ...match,
                courts
            };
        });

        return res.status(200).json(matchesWithSurface);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Internal error fetching all matches'
        });
    }
}

export const getMatch = async (req, res) => {
    try {
        const { id } = req.params;

        const match = await Match.findById(id)
            .populate('location', 'name address courts')
            .populate('players.user', 'name lastname ntrplvl profilePicture')
            .populate('backUps.user', 'name lastname ntrplvl profilePicture')
            .populate('createdBy', 'name lastname walletPaymentAllowed')
            .populate('generatedMatches.teamA.player1', 'name lastname ntrplvl profilePicture')
            .populate('generatedMatches.teamA.player2', 'name lastname ntrplvl profilePicture')
            .populate('generatedMatches.teamB.player1', 'name lastname ntrplvl profilePicture')
            .populate('generatedMatches.teamB.player2', 'name lastname ntrplvl profilePicture')
            .lean();

        if (!match) {
            return res.status(400).json({
                ok: false,
                message: "Match not found"
            });
        }

        const courts = match.courts.map(court => {

            const locationCourt = match.location.courts.find(
                lc => lc.number === court.courtNumber
            );

            return {
                ...court,
                surface: locationCourt?.surface || null
            };
        });

        match.courts = courts;

        return res.status(200).json(match);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Internal error obtaining match'
        });
    }
};

export const getOpenMatch = async (req, res) => {
    try {
        const matches = await Match.find({
                status: {
                  $in: ['Open', 'Full', 'Ready', 'Played', 'Playing']
                }
            })
            .sort({'date': 1})
            .populate('location', 'name address courts')
            .populate('players.user', 'name lastname ntrplvl profilePicture')
            .populate('backUps.user', 'name lastname ntrplvl profilePicture')
            .populate('createdBy', 'name lastname walletPaymentAllowed')
            .populate('generatedMatches.teamA.player1', 'name lastname ntrplvl profilePicture')
            .populate('generatedMatches.teamA.player2', 'name lastname ntrplvl profilePicture')
            .populate('generatedMatches.teamB.player1', 'name lastname ntrplvl profilePicture')
            .populate('generatedMatches.teamB.player2', 'name lastname ntrplvl profilePicture')
            .lean();

        if (!matches) {
            return res.status(404).json({
                ok: false,
                message: 'Match not found'
            });
        }

        const matchesWithSurface = matches.map(match => {

            const courts = match.courts.map(court => {

                const locationCourt = match.location.courts.find(
                    lc => lc.number === court.courtNumber
                );

                return {
                    ...court,
                    surface: locationCourt?.surface || null
                };
            });

            return {
                ...match,
                courts
            };
        });

        return res.status(200).json(matchesWithSurface);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Internal error fetching match'
        });
    }
}

export const updateMatch = async (req, res) => {
    try {

        const {
            id
        } = req.params;

        const {
            locationSlug,
            date,
            startTime,
            endTime,
            courtNumbers,
            paymentMethods
        } = req.body;

        const match = await Match.findById(id)

        if (!match) {
            return res.status(404).json({
                ok: false,
                message: 'Match not found or unavailable'
            });
        }

        //played matches
        if (match.status === 'Played') {
            return res.status(404).json({
                ok: false,
                message: 'Played matches cannot be updated'
            });
        }

        //if location changes
        const location = await Location.findOne({
            slug: locationSlug,
            active: true
        });

        if (!location) {
            return res.status(404).json({
                ok: false,
                message: 'Location not found or unavailable'
            });
        }

        //court validation

        const courtNumbersParsed = courtNumbers.map(Number);

        const activeCourts = location.courts
            .filter(c => c.active !== false)
            .map(c => c.number);

        const validSelection = courtNumbersParsed.every(c =>
            activeCourts.includes(c)
        );

        if (!validSelection) {
            return res.status(400).json({
                ok: false,
                message: 'Invalid court selection'
            });
        }

        const maxPlayers = courtNumbersParsed.length * 4;

        if (match.players.length > maxPlayers) {
            return res.status(404).json({
                ok: false,
                message: 'Too many players for selected courts'
            });
        }

        match.location = location._id;
        match.date = date;
        match.startTime = startTime;
        match.endTime = endTime;
        match.courtNumbers = courtNumbersParsed;
        match.maxPlayers = maxPlayers;
        match.paymentMethods = paymentMethods;

        await match.save();

        return res.status(200).json(match);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Internal error updating match'
        });
    }
}

export const joinMatch = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { asBackup = false, paymentMethod } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid match ID");
    }

    // 🔵 CAMBIO: antes esta validación solo se hacía para el join normal;
    // el join como backup no pedía paymentMethod en absoluto. Ahora se
    // exige siempre, porque el backup también elige método de pago.
    if (!paymentMethod) {
      throw new Error("Payment method required");
    }

    const user = await User.findById(userId).session(session);

    if(!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found'
      })
    }

    if (user.suspendedUntil && user.suspendedUntil > new Date()){
      return res.status(400).json({
        ok: false,
        message: `You are suspended and you cannot join a match until ${user.suspendedUntil.toLocaleDateString('es-ES')}`
      })
    }

    const match = await Match.findById(id).session(session)
                  .populate('location', 'name')
                  .populate('createdBy', 'walletPaymentAllowed');

    if (!match) {
      throw new Error("Match does not exist");
    }

    const validPaymentMethod = match.paymentMethods.find(
      pm => pm.type === paymentMethod
    );

    if (!validPaymentMethod) {
      throw new Error("Please select a valid payment method");
    }

    const estimatedPrice = Math.round((match.price / match.maxPlayers) * 100) / 100;
    const formattedDate = new Date(match.date).toLocaleDateString("es-ES");

    // 🔵 CAMBIO: función nueva, extraída para no duplicar la lógica de
    // wallet (antes estaba copiada dos veces: una en el join normal con
    // wallet, y no existía en absoluto para el backup). La usan tanto el
    // join de player como el de backup y el fallback de auto-backup.
    /**
     * Builds the payment sub-document for either a player or a backup join,
     * and — for wallet payments — deducts/holds the funds and records the
     * wallet transaction. Throws if the wallet isn't allowed / doesn't have
     * enough balance. Must run inside the outer transaction.
     */
    const buildPayment = async ({ holdLabel }) => {
      if (paymentMethod === "wallet") {
        if (!match.createdBy?.walletPaymentAllowed) {
          throw new Error("Wallet payment not available for this user");
        }

        if (user.walletBalance < estimatedPrice) {
          throw new Error("Insufficient balance");
        }

        user.walletBalance -= estimatedPrice;
        await user.save({ session });

        await WalletTransaction.create([{
          user: userId,
          amount: -estimatedPrice,
          type: "match_payment",
          status: "confirmed",
          note: `${holdLabel} ${formattedDate}`,
          match: match._id
        }], { session });

        return { method: "wallet", amount: estimatedPrice };
      }

      return { method: paymentMethod, amount: estimatedPrice };
    };

    /* ===================================================== */
    /* BACKUP JOIN — only once the match is Full             */
    /* ===================================================== */
    // 🔵 CAMBIO: antes se podía unir como backup con el match en estado
    // "Open" o "Full" (status: { $in: ["Open", "Full"] }). Ahora solo se
    // permite si ya está "Full". Además, ahora sí pasa por buildPayment()
    // (antes el backup se guardaba sin payment de ningún tipo).

    if (asBackup === true) {

      if (match.status !== "Full") {
        throw new Error("Backup spots are only available once the match is full");
      }

      const paid = await buildPayment({ holdLabel: "Backup wallet hold" });

      const updatedBackup = await Match.findOneAndUpdate(
        {
          _id: id,
          status: "Full",
          players: { $not: { $elemMatch: { user: userId } } },
          backUps: { $not: { $elemMatch: { user: userId } } },
          $expr: { $lt: [{ $size: "$backUps" }, "$maxBackups"] }
        },
        {
          $push: {
            backUps: {
              user: userId,
              joinedAt: new Date(),
              payment: {
                method: paid.method,
                status: paid.method === "wallet" ? "held" : "unpaid",
                amount: paid.amount,
                heldAt: paid.method === "wallet" ? new Date() : undefined
              }
            }
          }
        },
        { new: true, session }
      );

      if (!updatedBackup) {
        throw new Error("Backup list is full or already registered");
      }

      await session.commitTransaction();

      return res.status(200).json({
        role: "backup",
        match: updatedBackup
      });
    }

    /* ===================================================== */
    /* NORMAL PLAYER JOIN                                    */
    /* ===================================================== */

    const paidPlayer = await buildPayment({ holdLabel: "Match join" });

    const updatedMatch = await Match.findOneAndUpdate(
      {
        _id: id,
        status: { $in: ["Open", "Full"] },
        players: { $not: { $elemMatch: { user: userId } } },
        backUps: { $not: { $elemMatch: { user: userId } } },
        $expr: { $lt: [{ $size: "$players" }, "$maxPlayers"] }
      },
      {
        $push: {
          players: {
            user: userId,
            joinedAt: new Date(),
            payment: {
              method: paidPlayer.method,
              status: paidPlayer.method === "wallet" ? "paid" : "unpaid",
              amount: paidPlayer.amount
            }
          }
        }
      },
      { new: true, session }
    );

    if (updatedMatch) {

      if (updatedMatch.players.length === updatedMatch.maxPlayers) {
        updatedMatch.status = "Full";
        await updatedMatch.save({ session });
      }

      await session.commitTransaction();

      try {
        await notifyOtherPlayersOfJoin(userId, user.name, match.location.name, formattedDate );
      } catch (notifError) {
        console.error("Error sending join notification:", notifError);
      }

      return res.status(200).json({
        role: "player",
        match: updatedMatch
      });
    }

    /* ===================================================== */
    /* AUTO BACKUP IF FULL — reuses the same payment already  */
    /* collected/held above for the player attempt. The       */
    /* status: "Full" filter below is the source of truth —   */
    /* it re-checks the live document, not the stale `match`  */
    /* fetched at the top of this request.                    */
    /* ===================================================== */
    // 🔵 CAMBIO: antes, si elegías "wallet" y el match ya estaba lleno,
    // simplemente daba error "Match is full" y no te metía como backup
    // (solo pasaba con métodos que no fueran wallet). Ahora es simétrico:
    // el dinero/hold que ya se calculó arriba (paidPlayer) se reutiliza
    // tal cual para meterte como backup, sea cual sea el método elegido.

    const autoBackup = await Match.findOneAndUpdate(
      {
        _id: id,
        status: "Full",
        players: { $not: { $elemMatch: { user: userId } } },
        backUps: { $not: { $elemMatch: { user: userId } } },
        $expr: { $lt: [{ $size: "$backUps" }, "$maxBackups"] }
      },
      {
        $push: {
          backUps: {
            user: userId,
            joinedAt: new Date(),
            payment: {
              method: paidPlayer.method,
              status: paidPlayer.method === "wallet" ? "held" : "unpaid",
              amount: paidPlayer.amount,
              heldAt: paidPlayer.method === "wallet" ? new Date() : undefined
            }
          }
        }
      },
      { new: true, session }
    );

    if (autoBackup) {
      await session.commitTransaction();

      return res.status(200).json({
        role: "backup",
        match: autoBackup
      });
    }

    throw new Error("Match is fully booked");

  } catch (error) {
    await session.abortTransaction();

    return res.status(400).json({
      ok: false,
      message: error.message || "Internal error joining match"
    });
  } finally {
    session.endSession();
  }
};

export const generateMatches = async (req, res) => {

    try {

        const { id } = req.params;

        const match = await Match.findById(id)
            .populate('location', 'name')
            .populate('players.user', 'name lastname ntrplvl')
            .populate('backUps.user', 'name lastname');

        if (!match) {
            return res.status(400).json({
                ok: false,
                message: 'Match not found'
            });
        }

        if (match.generatedMatches.length > 0) {
            return res.status(400).json({
                ok: false,
                message: 'Matches already generated'
            });
        }

        let players = [...match.players];

        const courts = Math.floor(players.length / 4);

        match.generatedMatches = [];

        let previousRoundMatches = [];

        for (let round = 1; round <= 2; round++) {

            let roundPlayers = shuffleArray(players);

            let byePlayer = null;

            if (roundPlayers.length % 4 !== 0) {
                byePlayer = roundPlayers.pop();
            }

            const pairs = generateCompetitivePairs(
                roundPlayers,
                previousRoundMatches
            );

            const roundMatches = generateBalancedMatches(
                pairs,
                courts
            );


            roundMatches.forEach((m, index) => {

              const courtData = match.courts?.[index];

                const matchData = {
                    round,
                    court: courtData?.courtNumber || null,
                    teamA: {
                        player1: m.pairA[0].user._id,
                        player2: m.pairA[1].user._id
                    },
                    teamB: {
                        player1: m.pairB[0].user._id,
                        player2: m.pairB[1].user._id
                    },
                    averageNTRPA: averageNTRP(m.pairA),
                    averageNTRPB: averageNTRP(m.pairB),
                    hasBye: !!byePlayer,
                    byePlayer: byePlayer ? byePlayer.user : null
                };

                match.generatedMatches.push(matchData);
                previousRoundMatches.push(matchData);
            });
        }

        match.status = 'Ready';

        await match.save();

        return res.status(200).json(match.generatedMatches);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            message: 'Internal error generating matches'
        });
    }
};

export const updateGeneratedMatches = async (req, res) => {
  try {

    const { matchId } = req.params;

    const generatedMatches = req.body;

    if (!Array.isArray(generatedMatches)) {
      return res.status(400).json({
        ok: false,
        message: "Body must be an array"
      });
    }

    const match = await Match.findById(matchId)
      .populate("players.user", "ntrplvl");

    if (!match) {
      return res.status(404).json({
        ok: false,
        message: "Match not found"
      });
    }

    if (match.status !== "Ready") {
      return res.status(400).json({
        ok: false,
        message: "Match must be Ready to update"
      });
    }

    const validPlayerIds = match.players.map(p =>
      p.user._id.toString()
    );

    const roundMap = {};
    const cleanedMatches = [];

    for (const m of generatedMatches) {

      if (!m.round || !m.court || !m.teamA || !m.teamB) {
        return res.status(400).json({
          ok: false,
          message: "Invalid match structure"
        });
      }

      const players = [
        m.teamA.player1,
        m.teamA.player2,
        m.teamB.player1,
        m.teamB.player2
      ];

      if (players.includes(undefined) || players.length !== 4) {
        return res.status(400).json({
          ok: false,
          message: "Each match must contain exactly 4 players"
        });
      }

      if (new Set(players.map(p => p.toString())).size !== 4) {
        return res.status(400).json({
          ok: false,
          message: "Duplicate player inside same match"
        });
      }

      for (const pid of players) {
        if (!validPlayerIds.includes(pid.toString())) {
          return res.status(400).json({
            ok: false,
            message: "Invalid player detected"
          });
        }
      }

      if (!roundMap[m.round]) {
        roundMap[m.round] = new Set();
      }

      for (const pid of players) {
        if (roundMap[m.round].has(pid.toString())) {
          return res.status(400).json({
            ok: false,
            message: `Player repeated in round ${m.round}`
          });
        }
        roundMap[m.round].add(pid.toString());
      }

      // 🔥 Recalcular averages automáticamente
      const pA1 = match.players.find(p => p.user._id.toString() === m.teamA.player1);
      const pA2 = match.players.find(p => p.user._id.toString() === m.teamA.player2);
      const pB1 = match.players.find(p => p.user._id.toString() === m.teamB.player1);
      const pB2 = match.players.find(p => p.user._id.toString() === m.teamB.player2);

      const avgA = Number(((pA1.user.ntrplvl + pA2.user.ntrplvl) / 2).toFixed(2));
      const avgB = Number(((pB1.user.ntrplvl + pB2.user.ntrplvl) / 2).toFixed(2));

      cleanedMatches.push({
        round: m.round,
        court: m.court,
        teamA: m.teamA,
        teamB: m.teamB,
        averageNTRPA: avgA,
        averageNTRPB: avgB,
        hasBye: false,
        byePlayer: null
      });
    }

    match.generatedMatches = cleanedMatches;

    await match.save();

    return res.status(200).json({
      ok: true,
      message: "Matches updated successfully",
      generatedMatches: match.generatedMatches
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal error updating match"
    });
  }
};

export const updateMatchStatus = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            status
        } = req.body;

        const allowed = ['Open', 'Full', 'Closed', 'Played', 'Cancelled'];

        if (!allowed.includes(status)) {
            return res.status(400).json({
                ok: false,
                message: 'Select a valid status'
            })
        }

        const match = await Match.findById(id);

        if (!match) {
            return res.status(400).json({
                ok: false,
                message: 'Match not found'
            })
        }

        if (match.status === "Played" || match.status === 'Closed') {
            return res.status(400).json({
                ok: false,
                message: 'Played or closed matches cannot be updated'
            })
        }

        match.status = status;

        if(status === 'Played'){
            match.wasPlayed = true;
        }

        await match.save();

        return res.status(200).json(match)


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            message: 'Select a valid status'
        })
    }
}


export const removeMatchCourts = async (req, res) => {
    try {
        const {
            matchId,
            courtNumber
        } = req.params;

        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(400).json({
                ok: false,
                message: 'Match not found'
            });
        }

        if (match.status !== 'Open' && match.status !== 'Full') {
            return res.status(400).json({
                ok: false,
                message: 'Only open matches can be updated'
            });
        }

        const courtToRemove = Number(courtNumber);

        const courtExists = match.courts.some(
          c => c.courtNumber === courtToRemove
        );

        if(!courtExists){
            return res.status(400).json({
                ok: false,
                message: 'Court not found in this match'
            });
        }

        const remainingCourts = match.courts.filter(
            c => c.courtNumber !== courtToRemove
        );

        if (remainingCourts.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'There must be at least one court'
            });
        }

        const playerCount = match.players.length;
        const newMaxPlayers = remainingCourts.length * 4;

        const less24h = isLessThan24h(match.date, match.startTime);

        /* -------------------------------------------------- */
        /* ⏱️ NORMAL CASE (> 24h)                              */
        /* -------------------------------------------------- */
        if (!less24h) {
            // No permitir jugadores "a medias"
            if (playerCount % 4 !== 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'Cannot remove court while players are waiting to complete a court'
                });
            }

            // No permitir overflow
            if (playerCount > newMaxPlayers) {
                return res.status(400).json({
                    ok: false,
                    message: 'Too many players for remaining courts'
                });
            }
        }

        /* -------------------------------------------------- */
        /* 🔥 < 24h → expulsar últimos jugadores si hace falta */
        /* -------------------------------------------------- */

        let updatedPlayers = [...match.players];

        if (less24h && playerCount > newMaxPlayers) {
            const playersToRemove = playerCount - newMaxPlayers;

            // Ordenar por joinedAt DESC → últimos en entrar primero
            updatedPlayers.sort(
                (a, b) => b.joinedAt - a.joinedAt
            );

            // Eliminar los últimos jugadores
            updatedPlayers = updatedPlayers.slice(playersToRemove);

            // Volver a ordenar cronológicamente (opcional, pero limpio)
            updatedPlayers.sort(
                (a, b) => a.joinedAt - b.joinedAt
            );
        }

        const newPrice = remainingCourts.reduce(
          (sum, c) => sum + Number(c.price), 0
        )

        match.courts = remainingCourts;
        match.maxPlayers = newMaxPlayers;
        match.players = updatedPlayers;
        match.price = newPrice;

        await match.save();

        return res.status(200).json({
            removedCourt: courtToRemove,
            removedPlayers: playerCount - updatedPlayers.length,
            match
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Internal server error updating match courts'
        });
    }
};

export const addMatchCourts = async (req, res) => {
  try {

    const { matchId } = req.params;
    const { courts } = req.body;

    if (!Array.isArray(courts) || courts.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Courts array is required"
      });
    }

    const match = await Match
      .findById(matchId)
      .populate("location", "courts");

    if (!match) {
      return res.status(404).json({
        ok: false,
        message: "Match not found"
      });
    }

    if (match.status !== "Open" && match.status !== "Full") {
      return res.status(400).json({
        ok: false,
        message: "Only open matches can be updated"
      });
    }

    const availableCourts = match.location.courts
      .filter(c => c.active !== false)
      .map(c => c.number);

    const requestedCourtNumbers = courts.map(c => Number(c.courtNumber));

    const invalidCourts = requestedCourtNumbers.filter(
      c => !availableCourts.includes(c)
    );

    if (invalidCourts.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "Invalid courts",
        invalidCourts
      });
    }

    const existingCourtNumbers = match.courts.map(c => c.courtNumber);

    const duplicateCourts = requestedCourtNumbers.filter(
      c => existingCourtNumbers.includes(c)
    );

    if (duplicateCourts.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "Duplicate courts",
        duplicateCourts
      });
    }

    const updatedCourts = [
      ...match.courts,
      ...courts
    ].sort((a, b) => a.courtNumber - b.courtNumber);

    const newPrice = updatedCourts.reduce(
      (sum, c) => sum + Number(c.price),
      0
    );

    match.courts = updatedCourts;
    match.price = newPrice;
    match.maxPlayers = updatedCourts.length * 4;

    await match.save();

    return res.status(200).json({
      message: "Courts added",
      match
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Internal error adding courts"
    });

  }
};


// 🔵 CAMBIO: se han eliminado por completo las funciones acceptInvite()
// y declineInvite() que estaban aquí (el flujo de invitación por link de
// email, con token JWT). Ya no hacen falta: cuando se libera una plaza,
// leaveMatch() y removePlayerMatch() (admin.js) promocionan directamente
// al siguiente backup con promoteNextBackup() y solo lo notifican.
export const leaveMatch = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { matchId } = req.params;
    const userId = req.user._id.toString();

    const match = await Match.findById(matchId)
      .populate("backUps.user", "email")
      .session(session);

    if (!match) throw new Error("Match not found");

    const less24 = isLessThan24h(match.date, match.startTime);

    if (["Playing", "Played", "Cancelled", "Closed"].includes(match.status)) {
      throw new Error("Can only leave open or full matches");
    }

    const playerObj = match.players.find((p) => {
      const playerId = p.user._id
        ? p.user._id.toString()
        : p.user.toString();
      return playerId === userId;
    });

    const isBackup = match.backUps.some(
      (b) => b.user._id.toString() === userId
    );

    if (!playerObj && !isBackup) {
      throw new Error("Player not registered to this match");
    }

    if (less24 && playerObj) {
      throw new Error("Cannot leave match if starting in less than 24 hours");
    }

    /* -------------------- */
    /* BACKUP LEAVE — always allowed, refund wallet hold if any */
    /* -------------------- */
    // 🔵 CAMBIO: antes esto solo hacía match.backUps = match.backUps.filter(...)
    // y no tocaba el wallet para nada. Ahora, si el backup había pagado con
    // wallet (payment.status === 'held'), se le hace refund antes del commit.
    if (isBackup) {
      const backupObj = match.backUps.find(
        (b) => b.user._id.toString() === userId
      );

      match.backUps = match.backUps.filter(
        (b) => b.user._id.toString() !== userId
      );

      await match.save({ session });

      const formattedDate = new Date(match.date).toLocaleDateString("es-ES");

      await refundBackupWallet({
        backup: backupObj,
        userId,
        match,
        session,
        note: `Backup refund - left match ${formattedDate}`
      });

      await session.commitTransaction();

      return res.status(200).json(match);
    }

    /* -------------------- */
    /* PLAYER LEAVE         */
    /* -------------------- */

    const paymentMethod = playerObj?.payment?.method;

    // 💰 CALCULO DINÁMICO (LO QUE QUIERES)
    const paidAmount = match.price / match.maxPlayers;

    // 1️⃣ REMOVE PLAYER
    match.players = match.players.filter((p) => {
      const playerId = p.user._id
        ? p.user._id.toString()
        : p.user.toString();
      return playerId !== userId;
    });

    // 2️⃣ REOPEN MATCH
    if (match.players.length < match.maxPlayers) {
      match.status = "Open";
    }

    // 3️⃣ WALLET REFUND (SOLO SI WALLET)
    if (paymentMethod === "wallet") {

      await User.findByIdAndUpdate(
        userId,
        { $inc: { walletBalance: paidAmount } },
        { session }
      );

      const formattedDate = new Date(match.date).toLocaleDateString("es-ES");

      await WalletTransaction.create(
        [{
          user: userId,
          amount: paidAmount,
          type: "refund",
          status: "confirmed",
          note: `Refund leave match ${formattedDate}`,
          match: match._id
        }],
        { session }
      );
    }

    // 4️⃣ 🔵 CAMBIO: antes aquí se llamaba a inviteNextBackup(match), que
    // mandaba el email con el link de accept/decline y dejaba al backup
    // en status "invited" esperando respuesta. Ahora se le promociona
    // directo con promoteNextBackup() (dentro de esta misma transacción)
    // y solo se le avisa por push/email después del commit (más abajo).
    const promoted = promoteNextBackup(match);

    await match.save({ session });

    await session.commitTransaction();

    if (promoted) {
      notifyAutoPromoted(match._id, promoted.userId).catch(console.error);
    }

    return res.status(200).json({
      message: "User removed from match",
      match,
    });

  } catch (error) {
    await session.abortTransaction();

    return res.status(400).json({
      ok: false,
      message: error.message || "Error leaving match",
    });
  } finally {
    session.endSession();
  }
};