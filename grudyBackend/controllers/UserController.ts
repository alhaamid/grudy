import mongoose from "mongoose";
import { UserSchema } from "../models/User";
import promise from "promise";

export class UserController {
    User: mongoose.Model<mongoose.Document> = mongoose.model('User', UserSchema);

    constructor() {}

    public getAUser(email: string) {
        return new promise<Result>((resolve, reject) => {
            let condition = { email: { $eq: email } };
            this.User.findOne(condition, (err, user) => {
                if (err) {
                    console.log(err);
                    reject({code: 500, result: err});
                } else {
                    if (user) {
                        user.populate('courses', (err, populatedUser: mongoose.Document) => {
                            if (populatedUser) {
                                resolve({code: 200, result: populatedUser});
                            } else {
                                console.log("Error while populating user");
                                reject({code: 500, result: err});
                            }
                        })
                    } else {
                        console.log(`${email} not found`);
                        reject({code: 404, result: `${email} not found`});
                    }
                }
            });
        });
    }

    public addNewUser(userJSON) {
        let newUser = new this.User(userJSON);
        return new promise <Result>((resolve, reject) => {
            newUser.save((err, user) => {
                if (err) {
                    console.log("error while creating a new user", err);
                    reject({code: 500, result: err});
                } else {
                    resolve({code: 201, result: user});
                }
            });
        });
    }

    public enrollACourse(email: string, id: string) {
        return new promise <Result> ((resolve, reject) => {
            let condition = { email: { $eq: email } };
            let update = {$addToSet: { courses: { $each: [id] } }};
            let options = {new: true};
            this.User.findOneAndUpdate(condition, update, options, (err, user) => {
                if (err) {
                    console.log(err);
                    reject({code: 500, result: `Invalid course selected. ${id}`});
                } else {
                    if (user) {
                        user.populate('courses', (err, populatedUser: mongoose.Document) => {
                            if (populatedUser) {
                                resolve({code: 200, result: populatedUser});
                            } else {
                                console.log("Error while populating user");
                                reject({code: 500, result: err});
                            }
                        })
                    } else {
                        console.log(`${email} not found`);
                        reject({code: 404, result: `${email} not found`});
                    }
                }
            });
        });
    }

    public dropACourse(email: string, id: string) {
        return new promise <Result> ((resolve, reject) => {
            let condition = { email: { $eq: email } };
            let update = {$pull: { courses: { $in: [id] } }};;
            let options = {new: true};
            this.User.findOneAndUpdate(condition, update, options, (err, user) => {
                if (err) {
                    console.log(err);
                    reject({code: 500, result: `Invalid course selected. ${id}`});
                } else {
                    if (user) {
                        user.populate('courses', (err, populatedUser: mongoose.Document) => {
                            if (populatedUser) {
                                resolve({code: 200, result: populatedUser});
                            } else {
                                console.log("Error while populating user");
                                reject({code: 500, result: err});
                            }
                        })
                    } else {
                        console.log(`${email} not found`);
                        reject({code: 404, result: `${email} not found`});
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



/* 
enrollACourse....
this.getAUser(email)
.then(resultObj => {
    let exists = resultObj.result.courses.find(_id => _id === id);
    let toShow = null;
    if (!exists) {
        toShow = `course can be enrolled for ${email}`;

        // let condition = { email: { $eq: email } };
        // let update = {$addToSet: { courses: { $each: [id] } }};
        // let options = {new: true};

        // this.User.findOneAndUpdate(condition, update, options, (err, user) => {
        //     let toShow2 = null;
        //     if (err) {
        //         toShow2 = err;
        //         reject({code: 500, result: err});
        //     } else {
        //         if (user) {
        //             // console.log(user);
        //             toShow2 = `${email} enrolled in ${id}`;
        //             resolve({code: 200, result: user});
        //         } else {
        //             toShow2 = `${email} not found`;
        //             reject({code: 404, result: `${email} not found`});
        //         }
        //     }
        //     console.log(toShow2);
        // });

    } else {
        toShow = "course already enrolled";
        // reject({code: 403, result: `${email} already enrolled in ${id}`});
    }
    console.log(toShow);
})
.catch(err => {
    console.log(err);
    reject(err);
}); */



/* public dropACourse(email: string, courseCode: string) {
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
} */