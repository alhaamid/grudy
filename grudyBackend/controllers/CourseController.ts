import mongoose from "mongoose";
import { CourseSchema } from "../models/Course";
import promise from "promise";
import csv from 'csvtojson';

export class CourseController {
    Course: mongoose.Model<mongoose.Document> = mongoose.model('Course', CourseSchema);;

    constructor() {}

    public populateCourses(name: string) {
        return new promise ((resolve, reject) => {
            csv().fromFile(name)
            .then(allCoursesJSON => {
                for (let courseJSON of allCoursesJSON) {
                    let whichErr: boolean = null;

                    const aCourse = new this.Course(courseJSON);
                    aCourse.save((err: any) => {
                        if (err) {
                            if (err["code"] == 11000) {/* duplicate keys */}
                            else {
                                console.log("errormsg", err["errormsg"]); 
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
            // .subscribe((courseJSON, __) => {
            //     const aCourse = new this.Course(courseJSON);
            //     aCourse.save((err: any) => {
            //         if (err) {console.log(err["errmsg"]);} 
            //         else { console.log(`Successfully added ${aCourse["courseCode"]}`);}
            //     })
            //     res(true);
            // }, (err: CSVError) => {
            //     console.log(err.message);
            //     rej(err);
            // })
    }

    public getAllCourses() {
        return new promise((resolve, reject) => {
            this.Course.find((err: any, courses: any) => {
                let toShow = null;
                if (err) {
                    toShow = err;
                    reject({code: 404, result: err})
                } else {
                    toShow = "all courses found successfully";
                    resolve({code: 200, result: courses});
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