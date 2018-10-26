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

/* Course related */
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







/* User related */
// CREATE a user
routes.route('/user')
.post((req, res) => {
    userController.addNewUser(req.body)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
});

// GET a user
routes.route('/user/:email')
.get((req, res) => {
    userController.getAUser(req.params["email"])
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})

// Enroll user in a course
routes.route('/user/:email/enroll/:courseId')
.post((req, res) => {
    let email = req.params["email"];
    let courseId = req.params["courseId"];
    userController.enrollACourse(email, courseId)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})

// Drop user in a course
routes.route('/user/:email/drop/:courseId')
.delete((req, res) => {
    let email = req.params["email"];
    let courseId = req.params["courseId"];
    userController.dropACourse(email, courseId)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})



/* Post related */
// CREATE a post
routes.route('/post')
.post((req, res) => {
    postController.addNewPost(req.body)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})
// GET a post
routes.route('/post/:postId')
.get((req, res) => {
})
// UPDATE a post
.put((req, res) => {
})
// DELETE a post
.delete((req, res) => {
})



// GET all posts by a topic
routes.route('/post/topic/:topicId')
.get((req, res) => {
    postController.getAllPostsByTopic(req.params["topicId"])
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
});



/* Discussion related */
// CREATE a discussion
routes.route('/post/:postId/discussion')
.post((req, res) => {
    let postId = req.params["postId"];
    postController.addNewDiscussion(postId, req.body)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})
// GET all discussions in a post
routes.route('/post/:postId/discussion')
// Delete a discussion in a post
.get((req, res) => {
})
// GET a discussion in a post
routes.route('/post/:postId/discussion/:discussionId')
// Delete a discussion in a post
.get((req, res) => {
})
// UPDATE a discussion in a post
.put((req, res) => {
})
// DELETE a discussion in a post
.delete((req, res) => {
})