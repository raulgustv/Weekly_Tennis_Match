import mongoose from 'mongoose'

const rankingSchema = new mongoose.Schema({
    season:{
        type: String,
        required: true,
        trim: true
    }, 
    seasonYear:{
        type: Number,
        required: true
    },
    seasonType:{
        type: String,
        enum: ['Winter', 'Spring', 'Summer', 'Spring'],
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    rank: {
        type: Number,
        required: true,
        min: 1
    },
    rating:{
        type: Number,
        required: true,
        default: 1000
    }
})