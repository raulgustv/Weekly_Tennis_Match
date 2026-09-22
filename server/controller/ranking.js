import Ranking from "../models/Ranking.js";
import User from "../models/user.js";
import RankingMatch from "../models/RankingMatch.js";
import { isAtLeast18 } from "../helpers/dateHelpers.js";
import { generateRankingRoundProposal, resolveSeason } from "../services/rankingServices.js";




//registration
export const rankingRegistration = async(req, res) =>{
    try {

        const userId = req.user._id;

        const user = await User.findById(userId)

        const {acceptRankingRules, dateOfBirth} = req.body;

        if(!user || !user.isActive){
             return res.status(400).json({
                ok: false,
                message: 'User not found'
            })
        }

        if(user.isRanked){
             return res.status(400).json({
                ok: false,
                message: 'You are already registered for this rank'
            })
        }

        if(!user.ntrplvl){
             return res.status(400).json({
                ok: false,
                message: 'You must have an NTRP level to register'
            })
        }

        if(acceptRankingRules !== true){
             return res.status(400).json({
                ok: false,
                message: 'Pleaes accept the ranking rules to participate'
            })
        }

        const dob = dateOfBirth || user?.dateOfBirth;

        if(!dob || !isAtLeast18(dob)){
             return res.status(400).json({
                ok: false,
                message: 'You must be 18+ years old to participate'
            })
        }

         if(dateOfBirth && !user.dateOfBirth){ 
            user.dateOfBirth = dateOfBirth;
        }

        user.isRanked = true;
        user.rankingRegisteredAt = new Date();
        user.rankingRulesAccepted = true;
        user.rankingRulesAcceptedAt = new Date();
        user.rankingRulesVersion = 'v1';

        await user.save();

        return res.status(200).json({
            ok: true,
            message: 'Successful registration to the ranking',
            user
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'There was an error with your registration'
        })
    }
}

export const unRegisterRanking = async(req, res) =>{
    try {

        const userId = req.user._id;

        const user = await User.findById(userId);

        if(!user || !user.isRanked){
            return res.status(400).json({
                ok: false,
                message: 'User not found or not registered'
            })
        }

        user.isRanked = false;
        await user.save();

        await Ranking.updateMany(
            {userId: user._id, status: {$ne: 'retired'}},
            {$set: {status: 'retired', dateOfLeave: Date.now()}},
        )

        return res.status(200).json({
            ok: true,
            message: 'You have retired from the ranking'
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Unable to retire from ranking due to an internal error'
        })
    }
}

export const generateRoundProposal = async(req, res) =>{
    try {

        if(req.user.role !== 'admin'){
            return res.status(400).json({
                ok: false,
                message: 'You are not authorized to generate rankings'
            })
        }

        const {seasonId, round} = req.body;

        const result = await generateRankingRoundProposal({seasonId, round})

        return res.status(200).json({
            ok: true,
            message: 'Round proposed, please review and approve to publish when ready',
            ...result
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Unable to generate round proposal'
        })
    }
}

export const publishRankingRound = async(req, res) =>{
    try {

        if(req.user.role !== 'admin'){
            return res.status(400).json({
                ok: false,
                message: 'You are not authorized publish ranking round'
            })
        }

        const {seasonId, round} = req.body;

        const season = await resolveSeason(seasonId);

        const result = await RankingMatch.updateMany(
            {season: season._id, round, published: false},
            {$set: {published: true} }
        )

        return res.status(200).json({
            ok: true,
            message: 'Round published',
            matchesPublished: result.modifiedCount
        })

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Unable to generate round proposal'
        })
    }
}

export const closeRoundNow = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ ok: false, message: 'You are not authorized to close a ranking round' });
        }
 
        const { seasonId } = req.body;
        const result = await closeRound({ seasonId }); // CHANGE: llama al service — antes esto duplicaba toda la generación de ronda otra vez aquí mismo
 
        return res.status(200).json({ ok: true, message: 'Round closed and next round proposed', ...result });
 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, message: error.message || 'Internal error closing the ranking round' });
    }
};
 


export const submitRankingResult = async (req, res) => {
    const session = await mongoose.startSession();
 
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, message: errors.array()[0].msg });
        }
 
        const { matchId, sets, superTieBreak } = req.body;
        const userId = req.user.id;
 
        const match = await RankingMatch.findById(matchId);
 
        if (!match) {
            return res.status(404).json({ ok: false, message: 'Ranking match not found' });
        }
 
        if (![match.playerA.toString(), match.playerB.toString()].includes(userId)) {
            return res.status(403).json({ ok: false, message: 'You are not a participant in this match' });
        }
 
        if (match.status === 'played' || match.status === 'admin_resolved') {
            return res.status(400).json({ ok: false, message: 'This match result was already confirmed' });
        }
 
        session.startTransaction();
 
        const setsWonByA = sets.filter(s => s.gamesA > s.gamesB).length;
        const setsWonByB = sets.length - setsWonByA;
        const winnerIsA = setsWonByA > setsWonByB;
 
        const { gamesWinner, gamesLoser } = sumGames(sets, winnerIsA);
 
        const [rankingA, rankingB] = await Promise.all([
            Ranking.findOne({ userId: match.playerA, season: match.season }).session(session),
            Ranking.findOne({ userId: match.playerB, season: match.season }).session(session)
        ]);
 
        if (!rankingA || !rankingB) {
            await session.abortTransaction();
            return res.status(400).json({ ok: false, message: 'One of the players has no active ranking entry for this season' });
        }
 
        const { winnerDelta, loserDelta, multiplier } = computeRatingDelta({
            ratingWinner: winnerIsA ? rankingA.rating : rankingB.rating,
            ratingLoser: winnerIsA ? rankingB.rating : rankingA.rating,
            gamesWinner,
            gamesLoser
        });
 
        const deltaA = winnerIsA ? winnerDelta : loserDelta;
        const deltaB = winnerIsA ? loserDelta : winnerDelta;
 
        rankingA.rating += deltaA;
        rankingB.rating += deltaB;
        rankingA.lastRoundPlayed = match.round;
        rankingB.lastRoundPlayed = match.round;
 
        match.sets = sets;
        match.superTieBreak = superTieBreak || match.superTieBreak;
        match.winner = winnerIsA ? match.playerA : match.playerB;
        match.status = 'played';
        match.resultSource = 'player';
        match.playedAt = new Date();
        match.marginMultiplier = multiplier;
        match.ratingDelta = { playerA: deltaA, playerB: deltaB };
 
        if (!match.confirmedBy.map(String).includes(userId)) {
            match.confirmedBy.push(userId);
        }
 
        await Promise.all([
            match.save({ session }),
            rankingA.save({ session }),
            rankingB.save({ session })
        ]);
 
        const standings = await Ranking.find({ season: match.season, status: 'active' })
            .sort({ rating: -1 })
            .session(session);
 
        await Promise.all(standings.map((doc, index) =>
            Ranking.updateOne({ _id: doc._id }, { $set: { rank: index + 1 } }, { session })
        ));
 
        await session.commitTransaction();
 
        return res.status(200).json({
            ok: true,
            message: 'Result recorded',
            match,
            ratingDelta: { playerA: deltaA, playerB: deltaB }
        });
 
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.log(error)
        return res.status(500).json({ ok: false, message: 'Internal error submitting the ranking result' });
    } finally {
        session.endSession();
    }
};








