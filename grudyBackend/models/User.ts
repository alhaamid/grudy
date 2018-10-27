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
        default: "https://pbs.twimg.com/profile_images/582436192307703809/DqWJEB13_400x400.png"
    },
    courses: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        }],
        default: []
    }
    // courses: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Course',
    //     default: []
    // }]
});