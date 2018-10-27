import mongoose, { Promise } from "mongoose";
import { PostSchema } from "../models/Post";
import promise from "promise";

export class PostController {
    Post: mongoose.Model<mongoose.Document> = mongoose.model('Post', PostSchema);

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
}

export interface Result {
    code: number;
    result: any;
}