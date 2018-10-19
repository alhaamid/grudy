import express from 'express';
import { UserController } from "./controllers/UserController";
import { CourseController } from "./controllers/CourseController";

export const routes = express.Router();


let userController = new UserController();
let courseController = new CourseController();

routes.route('/')
.get((req, res) => {res.send('Backend Server is working');});

// GET all courses
routes.route('/course')
.get((req, res) => {
    courseController.getAllCourses()
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);})
});

// GET a course
routes.route('/course/:courseCode')
.get((req, res) => {
    courseController.getACourse(req.params["courseCode"])
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
});


routes.route('/user/:email')
// GET a user
.get((req, res) => {
    userController.getAUser(req.params["email"])
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})
// UPDATE a user
.put((req, res) => {
    // console.log(req.params["email"], req.body);
    let email = req.params["email"];
    if (req.body["enrollCourse"]) {
        userController.enrollACourse(email, req.body["enrollCourse"])
        .then(obj => {res.status(obj["code"]).send(obj["result"]);})
        .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
    } else if (req.body["dropCourse"]) {
        userController.dropACourse(email, req.body["dropCourse"])
        .then(obj => {res.status(obj["code"]).send(obj["result"]);})
        .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
    }
})

// CREATE a user
routes.route('/user')
.post((req, res) => {
    userController.addNewUser(req.body)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
});