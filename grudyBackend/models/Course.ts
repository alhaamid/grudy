import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const CourseSchema = new Schema({
    courseCode: {
        type: String,
        unique: true,
        index: true,
        required: 'Course Code is required'
    }, courseName: {
        type: String,
        required: 'Course Name is required'
    }
});