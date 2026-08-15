import Match from "../models/Match.js";
import SkillVote from "../models/Vote.js";
import User from "../models/user.js";

// Configuración del sistema de peso por NTRP
const NTRP_MIN = 1;
const NTRP_MAX = 5;
const WEIGHT_AT_NTRP_MIN = 0.4;
const WEIGHT_AT_NTRP_MAX = 1.6;
const NTRP_NEUTRAL = 3; // nivel que produce peso = 1.0

// impacto base y tope de seguridad por partido
const VOTE_IMPACT = 0.1;
const MAX_DELTA_PER_MATCH = 0.15; // ningún voto, sin importar el peso, mueve más de esto en un solo partido

// peso lineal centrado en NTRP_NEUTRAL, clamped a [WEIGHT_AT_NTRP_MIN, WEIGHT_AT_NTRP_MAX]
const calculateVoteWeight = (voterNTRP) => {
    const ntrp = voterNTRP || NTRP_NEUTRAL;
    const slope =
        ntrp >= NTRP_NEUTRAL
            ? (WEIGHT_AT_NTRP_MAX - 1) / (NTRP_MAX - NTRP_NEUTRAL)
            : (1 - WEIGHT_AT_NTRP_MIN) / (NTRP_NEUTRAL - NTRP_MIN);

    const rawWeight = 1 + (ntrp - NTRP_NEUTRAL) * slope;

    return Number(
        Math.min(WEIGHT_AT_NTRP_MAX, Math.max(WEIGHT_AT_NTRP_MIN, rawWeight)).toFixed(3)
    );
};

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

        // usuario que vota (necesitamos su NTRP para el peso)
        const voterUser = await User.findById(voterId);
        if (!voterUser) {
            return res.status(404).json({
                ok: false,
                message: "Voter user not found"
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

        // calcular peso del voto según NTRP del votante (snapshot en el momento de votar)
        const voterNTRP = voterUser.ntrplvl || NTRP_NEUTRAL;
        const weight = calculateVoteWeight(voterNTRP);

        // guardar voto
        await SkillVote.create({
            match: matchId,
            votedBy: voterId,
            votedUser: votedUserId,
            value,
            voterNTRP,
            weight
        });

        const votes = await SkillVote.find({
            match: matchId,
            votedUser: votedUserId
        });

        // promedio ponderado por el peso de cada votante
        // (dividido por el número de votos, NO por la suma de pesos,
        // para que el peso realmente afecte la magnitud del delta
        // y no solo la proporción dentro de un promedio acotado a [-1,1])
        const weightedSum = votes.reduce((sum, v) => sum + v.value * (v.weight || 1), 0);
        const avgVote = votes.length > 0 ? weightedSum / votes.length : 0;

        // impacto controlado, con tope de seguridad independiente del peso
        const rawDelta = avgVote * VOTE_IMPACT;
        const delta = Number(
            Math.min(MAX_DELTA_PER_MATCH, Math.max(-MAX_DELTA_PER_MATCH, rawDelta)).toFixed(2)
        );

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

