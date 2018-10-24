import express from 'express';
import { UserController } from "./controllers/UserController";
import { CourseController } from "./controllers/CourseController";
import { PostController } from "./controllers/PostController";

export const routes = express.Router();


let userController = new UserController();
let courseController = new CourseController();
let postController = new PostController();

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
routes.route('/course/:_id')
.get((req, res) => {
    courseController.getACourse(req.params["_id"])
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
    let email = req.params["email"];
    // enroll a course
    if (req.body["enrollCourse"]) {
        userController.enrollACourse(email, req.body["enrollCourse"])
        .then(obj => {res.status(obj["code"]).send(obj["result"]);})
        .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
    // drop a course
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


// CREATE a post
routes.route('/post')
.post((req, res) => {
    postController.addNewPost(req.body)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
});