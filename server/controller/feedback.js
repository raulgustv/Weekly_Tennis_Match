import FeedbackRequest from "../models/Feedback.js";
import User from "../models/user.js";

const COOLDOWN_DAYS = 21;
const SAMPLE_RATE = 0.15;
const MIN_LOGINS_FEEDBACK = 1

export const checkEligibility  = async(req, res) =>{
    try {

        const userId = req.user._id;
        const {triggerType} = req.query;

        if(!triggerType){
            return res.status(400).json({
                ok: false,
                message: 'Trigger type is required'
            })
        }

        //antiguedad cuenta 
        const user = await User.findById(userId).select("successfulLoginCount");

        if(!user || (user.successfulLoginCount || 0) < MIN_LOGINS_FEEDBACK){
            return res.status(200).json({
                eligible: false,
                message: 'Insuficcient logins for feedback'
            })
        }


        if(user.eligibleFeedback === false){
            return res.status(200).json({
                eligible: false,
                message: 'User not eligible for sample feedback'
            })
        }       

        //1. Buscar ultima solicitud (excepto user_initiated)
        const lastRequest = await FeedbackRequest.findOne({
            userId,
            triggerType: {$ne: 'user_initiated'}
        }).sort({shownAt: -1})

        if(lastRequest && lastRequest.dismissed){

            const daysSinceShown = (Date.now() - lastRequest.shownAt) / (1000 * 60 * 60 * 24)

            if(daysSinceShown < COOLDOWN_DAYS){
                    return res.status(200).json({
                        eligible: false,
                        reason: 'Cooldown'
                    })
                }   
            }           

        //const selected = Math.random() < SAMPLE_RATE;  
        const selected = true  
        

        if(!selected){
            return res.status(200).json({
                eligible: false,
                reason: 'Not sampled'
            })
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
            {_id: id, userId: req.user._id, responded: false, respondedAt: Date.now()},
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

