import mongoose from "mongoose";
import { PostSchema } from "../models/Post";
import { UserSchema } from "../models/User";
import { UserController } from ".././controllers/UserController";
import promise from "promise";

export class PostController {
    Post: mongoose.Model<mongoose.Document> = mongoose.model('Post', PostSchema);
    User: mongoose.Model<mongoose.Document> = mongoose.model('User', UserSchema);
    userController: UserController = new UserController();

    constructor() {}

    public addNewPost(postJSON) {
        let newPost = new this.Post(postJSON);
        return new promise <Result>((resolve, reject) => {
            newPost.save((err, post) => {
                if (err) {
                    console.log("error while creating a new post", err);
                    reject({code: 500, result: err});
                } else {

                    post.populate('postedBy', (err, populatedPost: mongoose.Document) => {
                        if (populatedPost) {
                            resolve({code: 200, result: populatedPost});
                        } else {
                            console.log("Error while populating post");
                            reject({code: 500, result: err});
                        }
                    })

                    resolve({code: 201, result: post});
                }
            });
        });
    }

    public getAllPostsByTopic(topicId: string) {
        return new promise<Result>((resolve, reject) => {
            let condition = {topicId: { $eq: topicId} };
            this.Post.find(condition)
            .populate('postedBy')
            .populate('discussions.startedBy')
            .exec((err, posts: mongoose.Document[]) => {
                if (err) {
                    console.log(err);
                    reject({code: 404, result: err});
                } else {
                    if (posts) {
                        resolve({code: 200, result: posts});
                    } else {
                        console.log(`no posts under ${topicId}`);
                        reject({code: 404, result: `no posts under ${topicId}`});
                    }
                }
            });
        });
    }

    public deletePost(postId: string) {
        return new promise<Result> ((resolve, reject) => {
            this.Post.findByIdAndDelete(postId)
            .exec((err, post: mongoose.Document[]) => {
                if (err) {
                    console.log(err);
                    reject({code: 404, result: err});
                } else {
                    if (post) {
                        resolve({code: 200, result: post});
                    } else {
                        console.log(`no post found under ${postId}`);
                        reject({code: 404, result: `no posts under ${postId}`});
                    }
                }
            });
        });
    }

    public updatePost(postId: string, clientUpdate: {}) {
        return new promise<Result> ((resolve, reject) => {
            let options = {new: true};
            this.Post.findByIdAndUpdate(postId, clientUpdate, options)
            .populate('postedBy')
            .populate('discussions.startedBy')
            .exec((err, updatedPost) => {
                if (err) {
                    console.log(err);
                    reject({code: 500, result: `Could not update post: ${postId}`});
                } else {
                    if (updatedPost) {
                        resolve({code: 200, result: updatedPost});
                    } else {
                        console.log(`no post with id: ${postId}`);
                        reject({code: 404, result: `no post with id: ${postId}`});
                    }
                }
            });
        });
    }


    public addADiscussion(postId: string, discussionJSON) {
        return new promise <Result> ((resolve, reject) => {
            let update = {$addToSet: { discussions: { $each: [discussionJSON] } }};
            let options = {new: true};
            this.Post.findByIdAndUpdate(postId, update, options)
            .populate('postedBy')
            .populate('discussions.startedBy')
            .exec((err, updatedPost) => {
                if (err) {
                    console.log(err);
                    reject({code: 500, result: `Invalid post given for adding a discussion. ${postId}`});
                } else {
                    if (updatedPost) {
                        resolve({code: 200, result: updatedPost});
                    } else {
                        console.log(`no post with id: ${postId}`);
                        reject({code: 404, result: `no post with id: ${postId}`});
                    }
                }
            });
        });
    }

    public deleteADiscussion(postId: string, discussionId: string) {
        return new promise <Result> ((resolve, reject) => {
            let update = {$pull: { discussions: { _id: discussionId } }};
            let options = {new: true};
            this.Post.findByIdAndUpdate(postId, update, options)
            .populate('postedBy')
            .populate('discussions.startedBy')
            .exec((err, updatedPost) => {
                if (err) {
                    console.log(err);
                    reject({code: 500, result: `Invalid post given for deleting a discussion. ${postId}`});
                } else {
                    if (updatedPost) {
                        resolve({code: 200, result: updatedPost});
                    } else {
                        console.log(`no post with id: ${postId}`);
                        reject({code: 404, result: `no post with id: ${postId}`});
                    }
                }
            });
        });
    }

    public updateADiscussion(postId: string, discussionId: string, discussionJSON) {
        return new promise<Result> ((resolve, reject) => {
            let conditions = { _id: postId, "discussions._id": discussionId};
            let attrUpdate = {};
            Object.keys(discussionJSON).forEach(key => {
                // if (key == "startedB")
                attrUpdate[`discussions.$.${key}`] = discussionJSON[key];
            });
            let update = {$set: attrUpdate};
            let options = {new: true};
            this.Post.findOneAndUpdate(conditions, update, options)
            .populate('postedBy')
            .populate('discussions.startedBy')
            .exec((err, updatedPost) => {
                if (err) {
                    console.log(err);
                    reject({code: 500, result: `Could not update post: ${postId}`});
                } else {
                    if (updatedPost) {
                        resolve({code: 200, result: updatedPost});
                    } else {
                        console.log(`no post with id: ${postId}`);
                        reject({code: 404, result: `no post with id: ${postId}`});
                    }
                }
            });
        });
    }

    public search(method: string, topicId: string, query: string) {
        if (method == "search by content") {
            return new promise <Result> ((resolve, reject) => {
                let condition = {
                    topicId: topicId,
                    $or: [
                        {'subject': {'$regex': query, '$options': 'ix'}},
                        {'content': {'$regex': query, '$options': 'ix'}},
                        {'discussions.subject': {'$regex': query, '$options': 'ix'}},
                        {'discussions.content': {'$regex': query, '$options': 'ix'}},
                    ]
                }
                this.Post.find(condition)
                .populate('postedBy')
                .populate('discussions.startedBy')
                .exec((err, posts: mongoose.Document[]) => {
                    if (err) {
                        console.log(err);
                        reject({code: 404, result: err});
                    } else {
                        if (posts) {
                            resolve({code: 200, result: posts});
                        } else {
                            console.log(`no posts with ${query} under ${topicId}`);
                            reject({code: 404, result: `no posts under ${topicId}`});
                        }
                    }
                });
            });
        } else if (method == "search by user") {
            return new promise <Result> ((resolve, reject) => {
                let allRelevantUserIds = []
                let condition = {
                    $or: [
                        {'displayName': {'$regex': query, '$options': 'ix'}},
                    ] }
                this.User.find(condition)
                .exec((err, users: mongoose.Document[]) => {
                    if (err) {
                        console.log(err);
                        reject({code: 404, result: err});
                    } else {
                        if (users.length>0) {
                            users.forEach(user => {
                                console.log(user);
                                allRelevantUserIds.push(user._id);
                            });
                            let or = []
                            allRelevantUserIds.forEach(id => {
                                or.push({'postedBy': id});
                                or.push({'discussions.startedBy': id});
                            })

                            let condition = {
                                topicId: topicId,
                                $or: or
                            }
                            this.Post.find(condition)
                            .populate('postedBy')
                            .populate('discussions.startedBy')
                            .exec((err, posts: mongoose.Document[]) => {
                                if (err) {
                                    console.log(err);
                                    reject({code: 404, result: err});
                                } else {
                                    if (posts) {
                                        resolve({code: 200, result: posts});
                                    } else {
                                        console.log(`no users with ${query} who have posted under ${topicId}`);
                                        reject({code: 404, result: `no users with ${query} who have posted under ${topicId}`});
                                    }
                                }
                            });
                        } else {
                            console.log(`no posts with ${query} under ${topicId}`);
                            reject({code: 404, result: `no posts under ${topicId}`});
                        }
                    }
                });
            });
        } else {
            return new promise <Result> ((resolve, reject) => {
                console.log(`unknown method: ${method}`);
                reject({code: 404, result: method});
            });
        }
    }

    getAllPostsByUser(email: string) {
        return new promise <Result> ((resolve, reject) => {
            this.userController.getAUser(email)
            .then(result => {
                let condition = {postedBy: { $eq: result.result._id} };
                this.Post.find(condition)
                .populate('course')
                .populate('postedBy')
                .populate('discussions.startedBy')
                .exec((err, posts: mongoose.Document[]) => {
                    if (err) {
                        console.log(err);
                        reject({code: 404, result: err});
                    } else {
                        if (posts) {
                            resolve({code: 200, result: posts});
                        } else {
                            console.log(`no posts posted by ${email}`);
                            reject({code: 404, result: `no posts posted by ${email}`});
                        }
                    }
                });
            })
            .catch(err => {
                reject(err);
            })
        });
    }
}

export interface Result {
    code: number;
    result: any;
}