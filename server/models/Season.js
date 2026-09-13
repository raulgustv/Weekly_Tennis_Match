import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    type:{
        type: String,
        enum: ['Winter', 'Spring', 'Summer', 'Fall'],,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'closed'],
        required: true
    },
    roundIntervalDays: {
        type: Number,
        default: 14
    },
    roundCloseTime: {
        type: String, 
        default: '21:00',
        trim: true
    },
    nextRoundCloseDate:{
        type: Date,
        default: null
    },
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    }
}, {timestamps: true});

seasonSchema.index(
    {status: 1},
    {unique: true, partialFilterExpression: {status: 'active'}}
)

export default mongoose.model('Season', seasonSchema)