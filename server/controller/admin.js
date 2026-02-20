import { adjustNTRPLevels } from "../jobs/adjustNTRP.js";
import Match from "../models/Match.js";
import User from "../models/user.js";

export const closeMatch = async(req, res) =>{
   try {
     const {id} = req.params;

    const match = await Match.findById(id);

    if(!match){
        return res.status(400).json({
            ok: false,
            message: "Match not found or does not exist"
        })
    }

    if(match.status !== "Played"){
        return res.status(400).json({
            ok: false,
            message: "Cannot close a match that has not been played"
        })
    }

    await adjustNTRPLevels(match?._id)

    match.status = "Closed";

    await match.save();

    res.status(200).json(match);
   } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error closing match'
        })
   }

}

export const adminAdjustNTRP = async(req,res) =>{
    try {
        const {userId} = req.params;
        const {newLevel} = req.body;

        const admin = req.user._id

        if(typeof newLevel !== "number"){
            return res.status(400).json({
                ok: false,
                message: "New NTRP level must be a number"
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                ok: false,
                message: "User not found"
            })
        };

        const oldLevel = user.ntrplvl;

        if(oldLevel === newLevel){
            return res.status(400).json({
                ok: false,
                message: "New level cannot be the same as te previous level"
            })
        }

        user.ntrplvl = Number(newLevel.toFixed(1));

        user.adjustmentHistory.push({
            change: Number((newLevel-oldLevel).toFixed(1)),
            currentNTRP: oldLevel,
            reason: 'Admin-adjustment'
        });

        if(user.adjustmentHistory.length > 20){
            user.adjustmentHistory.shift()
        }

        user.save();

        return res.status(200).json({
            message: 'Admin adjusted NTRP level',
            oldLevel, 
            newLevel: user.ntrplvl
        })


    } catch (error) {
         console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error adjusting NTRP for user'
        })
    }
}

export const togglePlayerActivation = async(req, res) =>{
    try {

        const {id} = req.params

        const user = await User.findById(id)

        if(!user) return res.status(400).json({
            ok: false,
            message: 'User not found'
        });    

        user.isActive = !user.isActive

        user.save();

        return res.status(200).json({
            active: user.isActive,
            user
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error with user activation or de-activation'
        });

    }
}

export  const removePlayerMatch = async(req, res) =>{
    try {

        const {playerId, matchId} = req.params;

        const user = await User.findById(playerId)
        const match = await Match.findById(matchId)

        if(!user || !match){
            return res.status(400).json({
                ok: false,
                message: 'User or match not found'
            });  
        }


        if(match.status !== 'Open' && match.status !== 'Full'){
            return res.status(400).json({
                ok: false,
                message: 'Cannot remove player for played, cancelled or closed matches'
            }); 
        }

        const isPlayer = match.players.some(p => p.user.toString() === user._id.toString())
        const isBackup = match.backUps.some(p => p.user.toString() === user._id.toString())

        if(!isPlayer && !isBackup){
            return res.status(400).json({
                ok: false,
                message: 'Player not registered to this match'
            }); 
        }

        if(isBackup){
            match.backUps = match.backUps.filter(p => p.user.toString() !== playerId.toString())

            await match.save();

            return res.status(200).json({
                message: "Player removed from match",
                match
            })    
        }

        //removing as player
        match.players = match.players.filter(p => p.user.toString() !== playerId.toString())

        //autopromote
        if(match.backUps.length > 0){
            const promotedUser = match.backUps.shift();
            match.players.push(promotedUser)
        }

        if(match.players.length < match.maxPlayers){
            match.status = 'Open'
        }

        await match.save();

        res.status(200).json({
            message: 'User successfully removed from match',
            match
        })


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            message: 'User not found'
        });  
    }
}

export const toggleAdminRole = async(req, res) =>{
    const {id} = req.body;

    try {
        const user = await User.findById(id).select('name lastname role isActive')


        if(!user) return res.status(400).json({
            ok: false,
            message: 'User not found'
        });

        if(!user.isActive) return res.status(400).json({
            ok: false,
            message: 'User is inactive'
        });
        

        if(id === req.user._id.toString()) return res.status(400).json({
            ok: false,
            message: 'You cannot change you own status'
        });

        user.role = user.role === 'admin' ? 'user' : 'admin';

        user.save();

        return res.status(200).json({
            message: 'User updated correctly',
            user
        });
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error updating user role'
        })
    }

    
}
