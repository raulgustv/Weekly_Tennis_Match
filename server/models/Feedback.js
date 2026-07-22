import mongoose from 'mongoose'

const {Schema} = mongoose

const feedbackSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    triggerType:{
        type: String,
        enum: ['post_action', 'friction', 'usage_milestone', 'user_initiated'],
        required: true
    },
    triggerContext: {
        type: Schema.Types.Mixed,
        default: {}
    },
    shownAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    responded: {
        type: Boolean,
        default: false
    },
    respondedAt:{
        type: Date,
        default: null
    },
    response: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            maxLength: 1000
        }
    },
    dismissed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

feedbackSchema.index({userId: 1, shownAt: -1})

const FeedbackRequest = mongoose.model('FeedbackRequest', feedbackSchema);

export default FeedbackRequest
