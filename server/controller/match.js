import Match from '../models/Match.js';
import Location from '../models/Location.js';
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
    inviteNextBackup
} from '../utils/backups.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';



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

        const totalPrice  = courts.reduce((sum, c) => sum + Number(c.price), 0);

        const maxPlayers = courtNumbersParsed.length * 4;

        const match = await Match.create({
            createdBy: req.user._id,
            location: location._id,
            courts,
            date,
            startTime,
            endTime,
            price: totalPrice,
            maxPlayers,
            paymentMethods
        });

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
            .populate('createdBy', 'name lastname')
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
            .populate('createdBy', 'name lastname')
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
        const match = await Match.find({
                status: "Open"
            })
            .populate("location", "name address")
            .populate('players.user', "name lastname ntrplvl")

        if (!match) {
            return res.status(404).json({
                ok: false,
                message: 'Match not found'
            });
        }

        return res.status(200).json(match)
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

// export const joinMatch = async (req, res) => {
//     try {
//         const {
//             id
//         } = req.params;
//         const userId = req.user._id;
//         const {
//             asBackup = false
//         } = req.body;

//         const match = await Match.findById(id);

//         if (!match) {
//             return res.status(404).json({
//                 ok: false,
//                 message: 'Match not found'
//             });
//         }

//         if (!['Open', 'Full'].includes(match.status)) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Match is not open for registration'
//             });
//         }

//         const alreadyJoined =
//             match.players.some(p => p.user.toString() === userId.toString()) ||
//             match.backUps.some(b => b.user.toString() === userId.toString());

//         if (alreadyJoined) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'User already registered in this match'
//             });
//         }

//         /* -------------------- */
//         /* Voluntary BACKUP     */
//         /* -------------------- */
//         if (asBackup === true) {
//             if (match.backUps.length >= match.maxBackups) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'Backup list is full'
//                 });
//             }

//             match.backUps.push({
//                 user: userId,
//                 joinedAt: new Date()
//             });

//             await match.save();

//             return res.status(200).json({
//                 role: 'backup',
//                 match
//             });
//         }

//         /* -------------------- */
//         /* Normal PLAYER join   */
//         /* -------------------- */
//         if (match.players.length < match.maxPlayers) {
//             match.players.push({
//                 user: userId,
//                 joinedAt: new Date()
//             });

//             // Status pasa a Full solo cuando se llena players
//             if (match.players.length === match.maxPlayers) {
//                 match.status = 'Full';
//             }

//             await match.save();

//             return res.status(200).json({
//                 role: 'player',
//                 match
//             });
//         }

//         /* -------------------- */
//         /* Auto BACKUP          */
//         /* -------------------- */
//         if (match.backUps.length < match.maxBackups) {
//             match.backUps.push({
//                 user: userId,
//                 joinedAt: new Date()
//             });

//             await match.save();

//             return res.status(200).json({
//                 role: 'backup',
//                 match
//             });
//         }

//         return res.status(400).json({
//             ok: false,
//             message: 'Match is fully booked'
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             ok: false,
//             message: 'Internal error joining match'
//         });
//     }
// };

export const joinMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { asBackup = false, paymentMethod } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid match ID"
      });
    }

    /* ===================================================== */
    /* VOLUNTARY BACKUP JOIN (ATOMIC)                       */
    /* ===================================================== */

    if (asBackup === true) {

      const updatedBackup = await Match.findOneAndUpdate(
        {
          _id: id,
          status: { $in: ["Open", "Full"] },
          players: { $not: { $elemMatch: { user: userId } } },
          backUps: { $not: { $elemMatch: { user: userId } } },
          $expr: { $lt: [{ $size: "$backUps" }, "$maxBackups"] }
        },
        {
          $push: {
            backUps: {
              user: userId,
              joinedAt: new Date()
            }
          }
        },
        { new: true }
      );

      if (!updatedBackup) {
        return res.status(400).json({
          ok: false,
          message: "Backup list is full or already registered"
        });
      }

      return res.status(200).json({
        role: "backup",
        match: updatedBackup
      });
    }

    /* ===================================================== */
    /* NORMAL PLAYER JOIN (ATOMIC - NO OVERBOOKING)         */
    /* ===================================================== */

    if(!paymentMethod){
        return res.status(400).json({
            ok: false,
            message: "Payment method required"
        })
    }

    //match validation
    const matchForValidation = await Match.findById(id).select("paymentMethods");

    if(!matchForValidation) {
        return res.status(400).json({
            ok: false,
            message: "Match does not exist"
        })
    }

    const validPaymentMethod =matchForValidation.paymentMethods.find(
        pm => pm.type === paymentMethod
    )

    if(!validPaymentMethod){
        return res.status(400).json({
            ok: false,
            message: "Please select a valid payment method"
        })
    }

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
                method: paymentMethod,
                status: "unpaid"
            }
          }
        }
      },
      { new: true }
    );

    if (updatedMatch) {

      // If match just became full
      if (updatedMatch.players.length === updatedMatch.maxPlayers) {
        updatedMatch.status = "Full";
        await updatedMatch.save();
      }

      return res.status(200).json({
        role: "player",
        match: updatedMatch
      });
    }

    /* ===================================================== */
    /* AUTO BACKUP IF FULL                                   */
    /* ===================================================== */

    const autoBackup = await Match.findOneAndUpdate(
      {
        _id: id,
        status: { $in: ["Open", "Full"] },
        players: { $not: { $elemMatch: { user: userId } } },
        backUps: { $not: { $elemMatch: { user: userId } } },
        $expr: { $lt: [{ $size: "$backUps" }, "$maxBackups"] }
      },
      {
        $push: {
          backUps: {
            user: userId,
            joinedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (autoBackup) {
      return res.status(200).json({
        role: "backup",
        match: autoBackup
      });
    }

    return res.status(400).json({
      ok: false,
      message: "Match is fully booked"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal error joining match"
    });
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


export const leaveMatch = async (req, res) => {

    try {
        const {
            matchId
        } = req.params;
        const userId = req.user._id.toString();

        const match = await Match.findById(matchId).populate('backUps.user', 'email')

        const less24 = isLessThan24h(match.date, match.startTime);

        if(less24) return res.status(200).json({
          ok: 'false',
          message: 'Cannot leave match if starting in less than 24 hours'
        })

        if (!match) return res.status(400).json({
            ok: false,
            message: 'Match not found'
        });

        if (['Playing', 'Played', 'Cancelled', 'Closed'].includes(match.status)) return res.status(400).json({
            ok: false,
            message: 'Can only leave open or full matches'
        });

        const isPlayer = match.players.some(p => {
            const playerId = p.user._id ? p.user._id.toString() : p.user.toString()
            return playerId === userId
        })

        const isBackup = match.backUps.some(b => 
            b.user._id.toString() === userId
        )

        if (!isPlayer && !isBackup) return res.status(400).json({
            ok: false,
            message: 'Player not registered to this match'
        });

        /* -------------------- */
        /* Leaving as BACKUP    */
        /* -------------------- */
        if (isBackup) {
            match.backUps = match.backUps.filter(
                b => b.user._id.toString() !== userId
            )

            await match.save();

            return res.status(200).json(match)
        }


        /* -------------------- */
        /* Leaving as player    */
        /* -------------------- */
        match.players = match.players.filter(p => {
            const playerId = p.user._id ? p.user._id.toString() : p.user.toString()
            return playerId !== userId
        })

        //reopen for free spots
        if (match.players.length < match.maxPlayers) {
            match.status = 'Open'
        }

        await match.save();

        await inviteNextBackup(match)

        res.status(200).json({
            message: 'User removed from match',
            match
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Error leaving match'
        });
    }

}

//accept invite
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.query;
    const {paymentMethod} = req.body;

    if (!token) {
      return res.status(400).json({
        ok: false,
        message: "Invitation token not provided"
      });
    }

     if (!paymentMethod) {
      return res.status(400).json({
        ok: false,
        message: "Please select a payment method"
      });
    }



    // 🔐 Verify token
    const { matchId, userId, type } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (type !== "MATCH_INVITE") {
      return res.status(400).json({
        ok: false,
        message: "Invalid invitation token"
      });
    }

    // Atomic promotion
    const updatedMatch = await Match.findOneAndUpdate(
      {
        _id: matchId,
        "backUps.user": userId,
        "backUps.status": "invited",
        $expr: { $lt: [{ $size: "$players" }, "$maxPlayers"] }
      },
      {
        $push: {
          players: {
            user: userId,
            joinedAt: new Date(),
            payment: {
                method: paymentMethod,
                status: "unpaid"
            }
          }
        },
        $pull: {
          backUps: {
            user: userId,
            status: "invited"
          }
        }
      },
      { new: true }
    );

    if (!updatedMatch) {
      return res.status(400).json({
        ok: false,
        message: "Invitation invalid, expired, or match full"
      });
    }

    //if match is now full
     if (updatedMatch.players.length === updatedMatch.maxPlayers) {
      updatedMatch.status = "Full";
      await updatedMatch.save();
    }

    return res.status(200).json({
      ok: true,
      message: "Joined match successfully",
      match: updatedMatch
    });

  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired invitation token"
    });
  }
};


export const declineInvite = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        ok: false,
        message: "Token not provided"
      });
    }

    // 🔐 Verify token
    const { matchId, userId, type } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (type !== "MATCH_INVITE") {
      return res.status(400).json({
        ok: false,
        message: "Invalid invitation token"
      });
    }

    // 🔒 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid match ID"
      });
    }

    // 🛡 Atomic removal
    const updatedMatch = await Match.findOneAndUpdate(
      {
        _id: matchId,
        "backUps.user": userId,
        "backUps.status": "invited"
      },
      {
        $pull: {
          backUps: {
            user: userId,
            status: "invited"
          }
        }
      },
      { new: true }
    );

    if (!updatedMatch) {
      return res.status(400).json({
        ok: false,
        message: "No active invitation to decline"
      });
    }

    // 🔄 Invite next backup (safe to call after atomic update)
    inviteNextBackup(updatedMatch).catch(console.error);

    return res.status(200).json({
      ok: true,
      message: "Invitation declined"
    });

  } catch (error) {
    console.log(error)
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired invitation token"
    });
  }
};