import mongoose from "mongoose";
import { UserSchema } from "../models/User";
import { Request, Response } from "express";

const User = mongoose.model('User', UserSchema);

export class UserController {
    public addNewUser(req: Request, res: Response) {
        let copy = req.body;
        // console.log(copy);
        copy["_id"] = copy["userId"];
        console.log(copy);
        let newUser = new User(copy);
        console.log(newUser);
    }
}