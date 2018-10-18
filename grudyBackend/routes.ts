import express from 'express';
import { CourseSchema } from "./models/Course";
import { UserSchema } from "./models/User";
import mongoose from "mongoose";
import { MongoError } from 'mongodb';
import { UserController } from "./controllers/UserController";

export const routes = express.Router();

let Course = mongoose.model('Course', CourseSchema);
let User = mongoose.model('User', UserSchema);

let userController = new UserController();

const MONGO_URI: string = 'mongodb://127.0.0.1:27017/';
const DB_NAME: string = 'grudy';
const DB_URI: string = MONGO_URI + DB_NAME;
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
    userController.getAUser(req.params)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})

// Create a user
routes.route('/user')
.post((req, res) => {
    userController.addNewUser(req.body)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
});