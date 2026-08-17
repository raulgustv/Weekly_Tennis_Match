import mongoose from 'mongoose'

const {Schema} = mongoose

const notificationSchema = new Schema({
    type:{
        type: String,
        enum: ['tour', 'update'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        enum: ['New', 'Improvement', 'Correction', 'Coming soon'],
        default: 'New'
    },
    version: {
        type: String, 
        default: null
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

