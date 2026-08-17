import User from "../models/user.js";
import Notification from "../models/Notification.js";



export const getNotifications = async(req, res) =>{
    try {
        const [notifications, user] = await Promise.all([
            Notification.find({active: true}).sort({createdAt: -1}).lean(),
            User.findById(req.user.id).select("seenNotificationIds").lean()
        ])

        const seenSet = new Set((user?.seenNotificationIds || []).map(String))

        const result  = notifications.map((n) => ({
            ...n,
            seen: seenSet.has(String(n._id))
        }))

        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal server error obtainin notifications'
        })
    }
}

export const seenNotifications = async(req, res) =>{
    try {
        const {ids} = req.body;
        const user = req.user._id;

        if(!Array.isArray(ids) || ids.length === 0){
            return res.status(400).json({
                ok: false,
                message: 'Ids must be a non empty array'
            })
        }

        await User.findByIdAndUpdate(user, {
            $addToSet: {seenNotificationIds: {$each: ids}}
        })

        return res.status(200).json({
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'There was a server error updating notifications as seen'
        })
    }
}


export const createNotification = async(req, res) =>{
    try {

        const user = req.user._id

        const userData = await User.findById(user).select('role')        

        if(userData.role !== 'admin'){
            return res.status(404).json({
                ok: false,
                message: 'Not authorized to this resource'
            })
        }

        const { type, title, description, tag, version, order } = req.body;

        const notification = await Notification.create({
            type,
            title,
            description,
            tag: tag || 'New',
            version: type === 'tour' ? version || 'v1' : null,
            order: type === 'tour' ? order || 0 : 0,
            active: true
        })

       res.status(201).json(notification)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Internal error creating notification'
        })
    }
}
