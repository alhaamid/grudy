import express from 'express';
import { CourseSchema } from "./models/Course";
import { UserSchema } from "./models/User";
import mongoose from "mongoose";
import { MongoError } from 'mongodb';
import { UserController } from "./controllers/UserController";

export const routes = express.Router();

const MONGO_URI: string = 'mongodb://127.0.0.1:27017/';
const DB_NAME: string = 'grudy';
const DB_URI: string = MONGO_URI + DB_NAME;

let Course = mongoose.model('Course', CourseSchema);
let User = mongoose.model('User', UserSchema);

mongoose.connect(DB_URI, (err: MongoError) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Succesfully Connected to Grudy Database!");
    }
});

routes.route('/')
.get((req, res) => {
    res.send('Hello World');
});


// Get all courses
routes.route('/course')
.get((req, res) => {
    Course.find((err: any, courses: any) => {
        if (err) {
          res.send("Error!");
        } else {
          res.send(courses);
        }
    }, (err) => {
        console.log(err);
    });
});

// Get a course
routes.route('/course/:courseId')
.get((req, res) => {
    let id = req.params['courseId'];
    Course.findById(id, (err, course) => {
        if (err) {
            res.send(err);
        } else {
            res.send(course);
        }
    });
});

// Get a user
routes.route('/user/:email')
.get((req, res) => {
    let email = req.params['email'];
    User.findOne({ email: { $eq: email } }, (err, user) => {
        if (err) {
            console.log("err", err);
            res.status(500).send(err);
        } else {
            if (user) {
                console.log("user found", user['email']);
                res.send(user);
            } else {
                console.log("user not found", req.params['email']);
                res.status(404).send("User not found");
            }
        }
    });
})

// Create a user
routes.route('/user')
.post((req, res) => {
    let newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) {
            console.log("error while creating a new user", err);
            res.status(500).send(err);
        } else {
            console.log(user["email"], "created successfully");
            res.status(201).send(user);
        }
    });
});

// .post((req, res) => {
//     console.log(req.body);
// });