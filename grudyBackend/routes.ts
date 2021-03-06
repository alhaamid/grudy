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
    let postId = req.params["postId"];
    postController.updatePost(postId, req.body)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})
// DELETE a post
.delete((req, res) => {
    let postId = req.params["postId"];
    postController.deletePost(postId)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})

// Search posts
routes.route('/post/search/subject/:topicId/:method/:query')
.get((req, res) => {
    let topicId = req.params["topicId"];
    let method = req.params["method"];
    let query = req.params["query"];
    let decodedQuery = decodeURI(query);
    postController.search(method, topicId, decodedQuery)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})

// GET all posts by a topic
routes.route('/post/topic/:topicId')
.get((req, res) => {
    postController.getAllPostsByTopic(req.params["topicId"])
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
});

// GET all posts by a user
routes.route('/post/user/:email')
.get((req, res) => {
    postController.getAllPostsByUser(req.params["email"])
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
});


/* Discussion related */
// CREATE a discussion
routes.route('/post/:postId/discussion')
.post((req, res) => {
    let postId = req.params["postId"];
    postController.addADiscussion(postId, req.body)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})
// GET all discussions in a post
routes.route('/post/:postId/discussion')
.get((req, res) => {
})
// GET a discussion in a post
routes.route('/post/:postId/discussion/:discussionId')
.get((req, res) => {
})
// UPDATE a discussion in a post
.put((req, res) => {
    let postId = req.params["postId"];
    let discussionId = req.params["discussionId"];
    postController.updateADiscussion(postId, discussionId, req.body)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})
// DELETE a discussion in a post
.delete((req, res) => {
    let postId = req.params["postId"];
    let discussionId = req.params["discussionId"];
    postController.deleteADiscussion(postId, discussionId)
    .then(obj => {res.status(obj["code"]).send(obj["result"]);})
    .catch(obj => {res.status(obj["code"]).send(obj["result"]);});
})