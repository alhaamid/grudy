import express from "express";
// import express = require("express");
import bodyParser from "body-parser";
import { routes } from './routes';
import mongoose from "mongoose";
import cors from 'cors';
import csv from 'csvtojson';
import promise from "promise";
import { CourseSchema } from "./models/Course";
import { UserSchema } from "./models/User";
import CSVError from "csvtojson/v2/CSVError";

const APP = express();
const PORT = 4201;

const MONGO_URI: string = 'mongodb://127.0.0.1:27017/';
const DB_NAME: string = 'grudy';
const DB_URI: string = MONGO_URI + DB_NAME;
const COURSE_FILE_NAME: string = "./assets/courses.csv";

const Course = mongoose.model('Course', CourseSchema);
const User = mongoose.model('User', UserSchema);

mongoose.connect(DB_URI, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Succesfully Connected to Grudy Database!");
        populateCourses(COURSE_FILE_NAME);
        // let sampleUser = {
        //     email: "haamid@gatech.edu",
        //     password: "haamid@gatech.edu",
        //     displayName: "haamid",
        // };
        // const aUser = new User(sampleUser);
        // aUser.save((err: any) => {
        //     if (err) {
        //         console.log("sample user error", err);
        //     } else {
        //         console.log("added sample user");
        //     }
        // });
    }
});

function populateCourses(name: string) {
    return new promise ((res, rej) => {
        csv().fromFile(name)
        .subscribe((courseJSON, __) => {
            const aCourse = new Course(courseJSON);
            aCourse.save((err: any) => {
                if (err) {
                    // console.log(err.message);
                } else {
                    console.log("Successfully added", aCourse);
                }
            })
            res(true);
        }, (err: CSVError) => {
            console.log(err.message);
            rej(err);
        })
    });
}

APP.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.header('Access-Control-Max-Ag', '3600');
    res.header('Accept', 'application/json');
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        console.log(`${req.ip} ${req.method} ${req.url}`);
        next();
    }
})

APP.use(bodyParser.json());
APP.use(express.json());
APP.use('/', routes);
APP.use(cors());

APP.set("port", process.env.PORT || PORT);

APP.listen(APP.get("port"), () => {
    console.log("Grudy backend server listening on 4201");
});