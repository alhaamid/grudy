import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const DiscussionSchema = new Schema({
    subject: {
        type: String,
        required: 'Subject is required'
    },
    content: {
        type: String,
        required: 'Post content is required'
    },
    postedWhen: {
        type: Date,
        default: Date.now,
        required: 'Date and Time of post is required'
    },
    startedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isResolved: {
        type: Boolean,
        default: false,
        required: 'isResolved is required'
    },
});