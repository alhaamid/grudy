import express from "express";
// import express = require("express");
import bodyParser from "body-parser";
import { routes } from './routes';
import mongoose from "mongoose";
import cors from 'cors';
import { CourseController } from "./controllers/CourseController"
import { MongoError } from "mongodb";

const APP = express();
const PORT = process.env.PORT || 4201;

const DB_NAME: string = '/grudy';
const CLOUD_MONGO_URL: string = `mongodb://haamid:haamid@grudycluster1-shard-00-00-bevsd.mongodb.net:27017,grudycluster1-shard-00-01-bevsd.mongodb.net:27017,grudycluster1-shard-00-02-bevsd.mongodb.net:27017${DB_NAME}?ssl=true&replicaSet=GrudyCluster1-shard-0&authSource=admin&retryWrites=true`;
const DB_URI: string = CLOUD_MONGO_URL;

// const MONGO_URI: string = 'mongodb://127.0.0.1:27017'
// const DB_URI: string = MONGO_URI + DB_NAME;
const COURSE_FILE_NAME: string = "./assets/courses.csv";

mongoose.connect(DB_URI, (err: MongoError) => {
    if (err) {console.log(`Mongoose connect err: ${err.message}`);} 
    else {
        console.log("Succesfully Connected to Grudy Database in Server!");
        let courseController = new CourseController();
        courseController.populateCourses(COURSE_FILE_NAME)
        .then(__ => {
            console.log("Courses populated either before or now");
            setupServer();
        })
        .catch(err => {console.log("catch", err);});
    }
});

function setupServer() {
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
    
    APP.set("port", PORT);
    
    APP.listen(APP.get("port"), () => {
        console.log(`Grudy backend server listening on ${PORT}`);
    });
}


/* function populateCourses(name: string) {
    return new promise ((res, rej) => {
        csv().fromFile(name)
        .subscribe((courseJSON, __) => {
            const aCourse = new Course(courseJSON);
            aCourse.save((err: any) => {
                if (err) {} 
                else { console.log("Successfully added", aCourse);}
            })
            res(true);
        }, (err: CSVError) => {
            console.log(err.message);
            rej(err);
        })
    });
} */