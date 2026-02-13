import Match from "../models/Match.js";
import SkillVote from "../models/Vote.js";
import User from "../models/user.js";

export const voteSkillLevel = async (req, res) => {
    try {
        const { id: matchId } = req.params;
        const voterId = req.user._id;
        const { votedUserId, value } = req.body;

        // validar voto
        if (![-1, 0, 1].includes(value)) {
            return res.status(400).json({
                ok: false,
                message: "Invalid vote value"
            });
        }

        // no votarse a sí mismo
        if (voterId.toString() === votedUserId.toString()) {
            return res.status(400).json({
                ok: false,
                message: "Cannot vote yourself"
            });
        }

        // usuario votado
        const votedUser = await User.findById(votedUserId);
        if (!votedUser) {
            return res.status(404).json({
                ok: false,
                message: "Voted user not found"
            });
        }

        // partido
        const match = await Match.findById(matchId);
        if (!match || match.status !== "Played") {
            return res.status(400).json({
                ok: false,
                message: "Match not found or has not been played"
            });
        }

        // validar que jugaron juntos
        const playedTogether = match.generatedMatches.some(gm => {
            const players = [
                gm.teamA.player1.toString(),
                gm.teamA.player2.toString(),
                gm.teamB.player1.toString(),
                gm.teamB.player2.toString()
            ];

            return (
                players.includes(voterId.toString()) &&
                players.includes(votedUserId.toString())
            );
        });

        if (!playedTogether) {
            return res.status(400).json({
                ok: false,
                message: "Players have not played together"
            });
        }

        // evitar doble voto
        const alreadyVoted = await SkillVote.findOne({
            match: matchId,
            votedBy: voterId,
            votedUser: votedUserId
        });

        if (alreadyVoted) {
            return res.status(400).json({
                ok: false,
                message: "You already voted this player in this match"
            });
        }

        // guardar voto
        await SkillVote.create({
            match: matchId,
            votedBy: voterId,
            votedUser: votedUserId,
            value
        });

        const votes = await SkillVote.find({
            match: matchId,
            votedUser: votedUserId
        });

        const totalVotes = votes.reduce((sum, v) => sum + v.value, 0);
        const avgVote = totalVotes / votes.length;

        // impacto controlado
        const VOTE_IMPACT = 0.1;
        const delta = Number((avgVote * VOTE_IMPACT).toFixed(2));

        const oldNTRP = votedUser.ntrplvl || 4;
        const newNTRP = Number((oldNTRP + delta).toFixed(2));

        votedUser.ntrplvl = newNTRP;

        // eliminar ajuste previo de este partido (si existe)
        votedUser.adjustmentHistory = votedUser.adjustmentHistory.filter(
            h => h.match?.toString() !== matchId
        );

        // guardar ajuste CONSENSO
        votedUser.adjustmentHistory.push({
            match: matchId,
            previousNTRP: oldNTRP,
            change: delta,
            currentNTRP: newNTRP,
            reason: "Match-average",
            at: new Date()
        });

        await votedUser.save();

        return res.status(201).json({
            ok: true,
            avgVote,
            delta,
            newNTRP
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Internal error voting user"
        });
    }
};


export const userVotesPerMatch = async(req, res) =>{
    try {

        const {matchId} = req.params;

        const votes = await SkillVote.find({
            match: matchId,
            votedBy: req.user._id
        })    

        const votedUserIds = votes.map(v => v.votedUser.toString());

        return res.status(200).json({
            ok: true,
            votedUserIds,
        })


        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal obtaining votes'
        })
    }
}

