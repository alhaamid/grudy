import mongoose from "mongoose";
import { UserSchema } from "../models/User";
import { MongoError } from "mongodb";
import promise from "promise";

export class UserController {
    DB_URI: string = 'mongodb://127.0.0.1:27017/grudy';
    User: mongoose.Model<mongoose.Document> = null;

    constructor() {
        this.User = mongoose.model('User', UserSchema);
        mongoose.connect(this.DB_URI, (err: MongoError) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log("Succesfully Connected to Grudy Database!");
            }
        });
    }

    public getAUser(params) {
        let email = params["email"]
        return new promise((resolve, reject) => {
            this.User.findOne({ email: { $eq: email } }, (err, user) => {
                if (err) {
                    reject({code: 500, result: err});
                } else {
                    if (user) {
                        resolve({code: 200, result: user});
                    } else {
                        reject({code: 404, result: "User not found"});
                    }
                }
            });
        });
    }

    public addNewUser(body) {
        let newUser = new this.User(body);
        return new promise ((resolve, reject) => {
            newUser.save((err, user) => {
                if (err) {
                    console.log("error while creating a new user", err);
                    // res.status(500).send(err);
                    reject({code: 500, result: err});
                } else {
                    console.log(user["email"], "created successfully");
                    // res.status(201).send(user);
                    resolve({code: 201, result: user});
                }
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