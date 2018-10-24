import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const PostSchema = new Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId
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
        type: String,
    },
    isResolved: {
        type: Boolean,
        default: false,
        required: 'isResolved is required'
    },
    /* 
    discussions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion'
    }] */    
});