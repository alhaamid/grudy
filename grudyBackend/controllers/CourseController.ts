import mongoose from "mongoose";
import { CourseSchema } from "../models/Course";
import { TopicSchema } from "../models/Topic";
import promise from "promise";
import csv from 'csvtojson';
import { Result } from "./UserController";

export class CourseController {
    Course: mongoose.Model<mongoose.Document> = mongoose.model('Course', CourseSchema);
    Topic: mongoose.Model<mongoose.Document> = mongoose.model('Topic', TopicSchema);

    constructor() {}

    public populateCourses(name: string) {
        return new promise ((resolve, reject) => {
            csv().fromFile(name)
            .then(allCoursesJSON => {
                for (let courseJSON of allCoursesJSON) {
                    let whichErr: boolean = null;

                    let topic1 = new this.Topic({name: "Quiz"});
                    let topic2 = new this.Topic({name: "Mid"});
                    let topic3 = new this.Topic({name: "Final"});
                    courseJSON["topics"] = [topic1, topic2, topic3];

                    const aCourse = new this.Course(courseJSON);
                    aCourse.save((err: any) => {
                        if (err) {
                            if (err["code"] == 11000) {/* duplicate keys */}
                            else {
                                console.log("errormsg", err); 
                                whichErr = err["errormsg"];
                            }
                        } 
                        else { console.log(`Successfully added ${aCourse["courseCode"]}`);}
                    })

                    if (whichErr) {
                        reject(whichErr);
                    } else {
                        resolve("success");
                    }
                }
            }, err => {
                reject(err);
            })
        });
    }

    public getAllCourses() {
        return new promise <Result> ((resolve, reject) => {
            this.Course.find((err: any, courses: any) => {
                if (err) {
                    console.log(err);
                    reject({code: 404, result: err})
                } else {
                    resolve({code: 200, result: courses});
                }
            }, (err) => {
                console.log(err);
            });
        });
    }

    public getACourse(id: string) {
        // let courseCode = params['courseCode'];
        return new promise <Result> ((resolve, reject) => {
            this.Course.findById(id, (err, course) => {
                if (err) {
                    console.log(err);
                    reject({code: 500, result: err});
                } else {
                    if (course) {
                        resolve({code: 200, result: course});
                    } else {
                        console.log(`${id} not found`);
                        reject({code: 404, result: `${id} not found`});
                    }
                }
            });
        });
    }
}


// Course.find((err: any, courses: any) => {
//     if (err) {
//       res.send("Error!");
//     } else {
//       res.send(courses);
//     }
// }, (err) => {
//     console.log(err);
// });

// let id = req.params['courseCode'];
    // Course.findById(id, (err, course) => {
    //     if (err) {
    //         res.send(err);
    //     } else {
    //         res.send(course);
    //     }
    // });