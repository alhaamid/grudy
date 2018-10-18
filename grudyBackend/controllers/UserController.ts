import mongoose from "mongoose";
import { UserSchema } from "../models/User";
import promise from "promise";

export class UserController {
    User: mongoose.Model<mongoose.Document> = mongoose.model('User', UserSchema);

    constructor() {}

    public getAUser(params) {
        let email = params["email"]
        return new promise((resolve, reject) => {
            this.User.findOne({ email: { $eq: email } }, (err, user) => {
                let toShow = null;
                if (err) {
                    toShow = err;
                    reject({code: 500, result: err});
                } else {
                    if (user) {
                        toShow = `${email} found successfully`;
                        resolve({code: 200, result: user});
                    } else {
                        toShow = `${email} not found`;
                        reject({code: 404, result: `${email} not found`});
                    }
                }
                console.log(toShow);
            });
        });
    }

    public addNewUser(body) {
        let newUser = new this.User(body);
        return new promise ((resolve, reject) => {
            newUser.save((err, user) => {
                let toShow = null;
                if (err) {
                    toShow = "error while creating a new user";
                    reject({code: 500, result: err});
                } else {
                    toShow = `${user["email"]} created successfully`;
                    resolve({code: 201, result: user});
                }
                console.log(toShow);
            });
        });
    }
}

// let email = req.params['email'];
// this.User.findOne({ email: { $eq: email } }, (err, user) => {
//     if (err) {
//         console.log("err", err);
//         res.status(500).send(err);
//     } else {
//         if (user) {
//             console.log("user found", user['email']);
//             res.send(user);
//         } else {
//             console.log("user not found", req.params['email']);
//             res.status(404).send("User not found");
//         }
//     }
// });