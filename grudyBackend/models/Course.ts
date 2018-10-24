import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { TopicSchema } from "./Topic";

export const CourseSchema = new Schema({
    courseCode: {
        type: String,
        unique: true,
        index: true,
        required: 'Course Code is required'
    }, 
    courseName: {
        type: String,
        required: 'Course Name is required'
    }, 
    topics: [TopicSchema],
});