import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './auth.service';
import { GlobalsService } from './globals.service';

@Injectable({
  providedIn: 'root'
})
export class GrudyService {
  private backendUrl: string = "http://localhost:4201";
  public listOfCourses: Course[] = null;

  constructor(private http: HttpClient, private gs: GlobalsService) {
    this.getAllOfferedCourses();
  }

  /* Course related */

  getAllOfferedCourses() {
    var str = '/course';
    this.http.get<[Course]>(this.backendUrl + str)
    .subscribe(loc => {this.listOfCourses = loc;});
  }

  getACourse(code: string) {
    return new Promise<Course>((res, rej) => {
      var str = '/course/' + code;
      this.http.get<Course>(this.backendUrl + str)
      .subscribe(
        course => {res(course);}, 
        err => {rej(err);}
      );
    });
  }

  /* User relead */
  
  getAUser(email: string) {
    return new Promise<User>((res, rej) => {
      var str = '/user/' + email;
      this.http.get<User>(this.backendUrl + str)
      .subscribe(
        user => {res(user);}, 
        err => {rej(err);}
      );
    });
  }

  createAUser(email: string, password: string, displayName: string, photoURL: string) {
    return new Promise<User> ((res, rej) => {
      const user: User = {
        displayName: displayName,
        email: email,
        password: password,
        photoURL: photoURL,
        courses: []
      }
      this.http.post<User>(this.backendUrl + "/user", user, {headers: new HttpHeaders({'Content-Type':  'application/json'})})
      .subscribe(user => {
        this.gs.log("created a user in createAUser", user);
        res(user);
      }, err => {
        this.gs.log("err in createAUser", err);
        rej(err);
      });
      // .toPromise()
      // .then(user => {
      //   this.gs.log("created a user in createAUser", user);
      //   res(user);
      // })
      // .catch(err => {
      //   this.gs.log("err in createAUser", err);
      //   rej(err);
      // });
    });
  }

  enrollACourse(email, courseCode) {
    return new Promise<User> ((res, rej) => {
      let update = {enrollCourse: courseCode};
      this.http.put<User>(this.backendUrl + "/user/" + email, update, {headers: new HttpHeaders({'Content-Type':  'application/json'})})
      .subscribe(user => {
        // console.log("enrollUser result", user);
        res(user);
      }, err => {
        // console.log("enrollUser err:", err);
        rej(err);
      })
    });
  }

  dropACourse(email, courseCode) {
    return new Promise<User> ((res, rej) => {
      let update = {dropCourse: courseCode};
      this.http.put<User>(this.backendUrl + "/user/" + email, update, {headers: new HttpHeaders({'Content-Type':  'application/json'})})
      .subscribe(user => {
        res(user);
      }, err => {
        rej(err);
      })
    });
  }
}

export interface Course {
  _id: string,
  courseCode: string,
  courseName: string,
  topics: [Topic]
}

interface Topic {
  _id: string,
  name: string
}


/* checkUser() {
  const sampleUser = {
    userId: 0x5bbfb9d5218008015115a701,
    displayName: "Haamid",
    email: "@gatech.edu",
    password: "password",
    photoURL: "https://pbs.twimg.com/profile_images/582436192307703809/DqWJEB13_400x400.png"
  }
  this.http.post(this.backendUrl+"/user", sampleUser, {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  }).toPromise()
  .then(val => {
    console.log("val", val);
  })
  .catch(err => {
    console.log("err", err);
  });
} */