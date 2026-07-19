import mongoose from "mongoose";

const courtSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    }, 
    surface: {
        type: String,
        enum: ['Quick', 'Hard', 'Clay', 'Grass'],
        default: "Quick"
    }, 
    favorite: {
        type: Boolean,
        default: false
    }
}, {_id: false});


const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    address: {
        type: String,
        required: true
    },
    courts:{
        type: [courtSchema],
        required: true
    },
    favorite: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

export default mongoose.model('Location', locationSchema)