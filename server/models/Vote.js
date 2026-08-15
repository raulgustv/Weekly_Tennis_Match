import mongoose from "mongoose";

const skillVoteSchema = new mongoose.Schema({
    match:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
        required: true
    },
    votedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    votedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    value:{
        type: Number,
        enum: [-1, 0, 1],
        required: true
    },
    voterNTRP: {
        type: Number
    },
    weight: {
        type: Number
    }
}, {timestamps: true});

/*avoid vote duplicates */

skillVoteSchema.index(
    {match: 1, votedBy: 1, votedUser: 1},
    {unique: true}
)

export default mongoose.model("SkillVote", skillVoteSchema)