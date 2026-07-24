import FeedbackRequest from "../models/Feedback.js";
import User from "../models/user.js";
import Match from "../models/Match.js";

const COOLDOWN_DAYS = 90;

export const checkEligibility  = async(req, res) =>{
    try {

        const userId = req.user._id;
        const {type, triggerType} = req.query;

        if(!triggerType || !type){
            return res.status(400).json({
                ok: false,
                message: 'Trigger type and type are required'
            })
        }

        if (type === "match") {
            return res.status(200).json({
                eligible: true
            });
        }

        //APP Feedback
        const user = await User.findById(userId).select('nextAppFeedbakMilestone lastAppFeedback')

        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'User not found'
            })
        }

        const completedMatches = await Match.countDocuments({
            status: 'Played',
            "players.user": userId
        });
        
        if(completedMatches < user.nextAppFeedbakMilestone){
            return res.status(200).json({
                eligible: false,
                reason: 'Milestone not reached'
            })
        }

        const pendingRequest = await FeedbackRequest.findOne({
            userId,
            type: "app",
            responded: false,
            dismissed: false,
        })

        if(pendingRequest){
             return res.status(200).json({
                eligible: false,
                reason: 'Pending request'
            })
        }

        if(user.lastAppFeedback){
            const daysSinceLastFeedback = (Date.now() - user.lastAppFeedback) / (1000 * 60 * 60 * 24)

            if (daysSinceLastFeedback < COOLDOWN_DAYS) {
                    return res.status(200).json({
                    eligible: false,
                    reason: 'Feedback cooldown'
                })
            }
        }

        return res.status(200).json({
            eligible: true
        })    
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error obtaining eligible users'
        })
    }
}

export const recordShown = async(req, res) =>{
    try {

        const userId = req.user._id;
        const {triggerType, triggerContext} = req.body;

        const feedbackRequest = await FeedbackRequest.create({
            userId,
            triggerType,
            triggerContext: triggerContext || {}
        })

        return res.status(201).json({
            feedbackRequestId: feedbackRequest._id
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error showing records'
        })
    }
}

export const submitResponse = async(req, res) =>{
    try {
        
        const {id} = req.params;
        const {rating, category, comment} = req.body;

        if(!rating || !category){
            return res.status(400).json(
                {
                    ok: false,
                    message: "Missing rating/category"
                }
            )
        }
        
        const feedbackRequest = await FeedbackRequest.findOneAndUpdate(
            {
                _id: id, 
                userId: req.user._id
            },
            {
                responded: true,
                respondedAt: Date.now(),
                response: {
                    rating,
                    category,
                    comment
                }
            }, {new: true}
        )

        if(!feedbackRequest){

            const exists = await FeedbackRequest.findOne({
                _id: id,
                userId: req.user._id
            })

            if(exists && exists.responded){
                return res.status(409).json({
                    eligible: false,
                    message: 'This feedback was already responded'
                })
            }

            return res.status(400).json({
                ok: false,
                message: 'Feedback request not found'
            })
        }

        if(feedbackRequest.triggerType !== 'user_initiated'){
            await User.findByIdAndUpdate(req.user._id, {
                eligibleFeedback: false
            })
        }

        return res.status(200).json({
            ok: true,
            feedbackRequest
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error obtaining feedback response'
        })
    }
}

export const dismissFeedback = async(req, res) =>{
    try {

        const {id} = req.params;

        const feedbackRequest = await FeedbackRequest.findOneAndUpdate(
            {_id: id, userId: req.user._id, responded: false},
            {dismissed: true}, 
            {new: true}
        )


        if(!feedbackRequest){
            return res.status(400).json({
                ok: false,
                message: 'Feedback request id not found'
            })
        }

        if(feedbackRequest.responded){
            return res.status(400).json({
                ok: false,
                message: 'This request has already been responded'
            })
        }

        return res.status(200).json({
            ok: true,
            feedbackRequest
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error dismissing feedback'
        })
    }
}