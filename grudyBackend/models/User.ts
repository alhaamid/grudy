import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        index: true,
        required: 'Email is required'
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    displayName: {
        type: String,
        index: true,
        required: 'Display name is required'
    },
    photoURL: {
        type: String,
        required: false,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});