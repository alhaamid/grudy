import mongoose from "mongoose";
import { UserSchema } from "../models/User";
import promise from "promise";

export class UserController {
    User: mongoose.Model<mongoose.Document> = mongoose.model('User', UserSchema);

    constructor() {}

    public getAUser(email: string) {
        // let email = params["email"]
        return new promise<Result>((resolve, reject) => {
            let condition = { email: { $eq: email } };
            this.User.findOne(condition, (err, user) => {
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

    public addNewUser(userJSON) {
        let newUser = new this.User(userJSON);
        return new promise <Result>((resolve, reject) => {
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

    public enrollACourse(email: string, courseCode: string) {
        return new promise <Result> ((resolve, reject) => {
            this.getAUser(email)
            .then(user => {
                let exists = user.result.courses.find(code => code === courseCode);
                let toShow = null;
                if (!exists) {
                    toShow = `course can be enrolled for ${email}`;

                    let condition = { email: { $eq: email } };
                    let update = {$addToSet: { courses: { $each: [courseCode] } }};
                    let options = {new: true};

                    this.User.findOneAndUpdate(condition, update, options, (err, user) => {
                        let toShow2 = null;
                        if (err) {
                            toShow2 = err;
                            reject({code: 500, result: err});
                        } else {
                            if (user) {
                                // console.log(user);
                                toShow2 = `${email} enrolled in ${courseCode}`;
                                resolve({code: 200, result: user});
                            } else {
                                toShow2 = `${email} not found`;
                                reject({code: 404, result: `${email} not found`});
                            }
                        }
                        console.log(toShow2);
                    });

                } else {
                    toShow = "course already enrolled";
                    reject({code: 403, result: `${email} already enrolled in ${courseCode}`});
                }
                console.log(toShow);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    public dropACourse(email: string, courseCode: string) {
        return new promise <Result> ((resolve, reject) => {
            this.getAUser(email)
            .then(user => {
                let exists = user.result.courses.find(code => code === courseCode);
                let toShow = null;
                if (exists) {
                    toShow = `${courseCode} can be dropped for ${email}`;

                    let condition = { email: { $eq: email } };
                    let update = {$pull: { courses: { $in: [courseCode] } }};
                    let options = {new: true};

                    this.User.findOneAndUpdate(condition, update, options, (err, user) => {
                        let toShow2 = null;
                        if (err) {
                            toShow2 = err;
                            reject({code: 500, result: err});
                        } else {
                            if (user) {
                                // console.log(user);
                                toShow2 = `${courseCode} dropped for ${email}`;
                                resolve({code: 200, result: user});
                            } else {
                                toShow2 = `${email} not found`;
                                reject({code: 404, result: `${email} not found`});
                            }
                        }
                        console.log(toShow2);
                    });

                } else {
                    toShow = `${courseCode} does not exist`;
                    reject({code: 403, result: `${email} already not enrolled in ${courseCode}`});
                }
                console.log(toShow);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
}

export interface Result {
    code: number;
    result: any;
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