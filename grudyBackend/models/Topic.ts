import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const TopicSchema = new Schema({
    name: {
        type: String,
        required: 'Topic name is required'
    }
});