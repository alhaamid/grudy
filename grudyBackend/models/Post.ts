import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { DiscussionSchema } from "./Discussion";

const PostSchema = new Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
    },
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
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isResolved: {
        type: Boolean,
        default: false,
        required: 'isResolved is required'
    },
    discussions: {
        type: [DiscussionSchema],
        default: []
    }
    // discussions: [DiscussionSchema]
});

PostSchema.index({subject: 'text', content: 'text'});

export {PostSchema};