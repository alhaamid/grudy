import mongoose from "mongoose";
import { PostSchema } from "../models/Post";
import promise from "promise";

export class UserController {
    Post: mongoose.Model<mongoose.Document> = mongoose.model('Post', PostSchema);

    constructor() {}

    public addNewPost(postJSON) {
        
    }
}

export interface Result {
    code: number;
    result: any;
}