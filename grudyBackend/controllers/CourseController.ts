import mongoose from "mongoose";
import { CourseSchema } from "../models/Course";
import { MongoError } from "mongodb";
import promise from "promise";

export class CourseController {
    DB_URI: string = 'mongodb://127.0.0.1:27017/grudy';
    Course: mongoose.Model<mongoose.Document> = null;

    constructor() {
        this.Course = mongoose.model('Course', CourseSchema);
        mongoose.connect(this.DB_URI, (err: MongoError) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log("Succesfully Connected to Grudy Database in Courses!");
            }
        });
    }

    public getAllCourses() {
        return new promise((resolve, reject) => {
            this.Course.find((err: any, courses: any) => {
                let toShow = null;
                if (err) {
                    toShow = err;
                    reject({code: 404, result: err})
                //   res.send("Error!");
                } else {
                    toShow = "all courses found successfully";
                    resolve({code: 200, result: courses});
                //   res.send(courses);
                }
                console.log(toShow);
            }, (err) => {
                console.log(err);
            });
        });
    }

    public getACourse(params) {
        let courseCode = params['courseCode'];
        return new promise((resolve, reject) => {
            this.Course.findOne({ courseCode: { $eq: courseCode } }, (err, course) => {
                let toShow = null;
                if (err) {
                    toShow = err;
                    reject({code: 500, result: err});
                } else {
                    if (course) {
                        toShow = `${courseCode} found successfully`;
                        resolve({code: 200, result: course});
                    } else {
                        toShow = `${courseCode} not found`;
                        reject({code: 404, result: `${courseCode} not found`});
                    }
                }
                console.log(toShow);
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