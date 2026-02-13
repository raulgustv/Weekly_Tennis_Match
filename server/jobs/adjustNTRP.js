import User from '../models/user.js'
import SkillVote from '../models/Vote.js'

export const adjustNTRPLevels = async(matchId) =>{
    console.log('Running NTRP adjustment');

    const votes = await SkillVote.aggregate([
        {$match: {match: matchId}},
        {
            $group:{
                _id: "$votedUser",
                total: {$sum: "$value"},
                count: {$sum: 1}
            }
        }
    ]);

    for(const v of votes){
        if(v.count < 3) continue;

        let change = 0;

        if(v.total >= 2) change = +0.1;
        if(v.total <= -2) change = -0.1;

        if(change === 0) continue;

        const user = await User.findById(v._id);

        if(!user) continue;

        const old = user.ntrplvl;
        const next = Number((old + change).toFixed(1))

        if(old === next) continue;

        user.adjustmentHistory.push({
            change,
            reason: "Social-vote"
        });

        user.ntrplvl = Math.min(7, Math.max(1, next))

        await user.save();
    }

}