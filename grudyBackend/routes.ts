import express from 'express';
import { UserController } from "./controllers/UserController";
import { CourseController } from "./controllers/CourseController";

export const routes = express.Router();


let userController = new UserController();
let courseController = new CourseController();

routes.route('/')
.get((req, res) => {
    res.send('Hello World');
});

// Get all courses
routes.route('/course')
.get((req, res) => {
    courseController.getAllCourses()
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);})
});

// Get a course
routes.route('/course/:courseCode')
.get((req, res) => {
    courseController.getACourse(req.params)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
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