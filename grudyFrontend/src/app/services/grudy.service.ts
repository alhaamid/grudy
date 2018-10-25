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

  getACourse(id: string) {
    return new Promise<Course>((res, rej) => {
      var str = '/course/' + id;
      this.http.get<Course>(this.backendUrl + str)
      .subscribe(
        course => {res(course);}, 
        err => {rej(err);}
      );
    });
  }

  /* User related */
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
    });
  }

  enrollACourse(email, id) {
    return new Promise<User> ((res, rej) => {
      let update = {enrollCourse: id};
      this.http.put<User>(this.backendUrl + "/user/" + email, update, {headers: new HttpHeaders({'Content-Type':  'application/json'})})
      .subscribe(user => {
        // console.log("enrollUser result", user);
        res(user);
      }, err => {
        console.log("enrollUser err:", err);
        rej(err);
      })
    });
  }

  dropACourse(email, id) {
    return new Promise<User> ((res, rej) => {
      let update = {dropCourse: id};
      this.http.put<User>(this.backendUrl + "/user/" + email, update, {headers: new HttpHeaders({'Content-Type':  'application/json'})})
      .subscribe(user => {
        res(user);
      }, err => {
        rej(err);
      })
    });
  }

  getUsersCourses(email): Promise<Course[]> {
    return new Promise<Course[]> ((resolve, reject) => {
      this.getAUser(email)
      .then(user => {resolve(user.courses)})
      .catch(err => {reject(err)});
    });
  }

  /* Posts related */
  createAPost(topicId: string, subject: string, content: string, postedBy: string) {
    return new Promise<Post> ((res, rej) => {
      const post: Post = {
        topicId: topicId,
        subject: subject,
        content: content,
        postedBy: postedBy
      }
      this.http.post<Post>(this.backendUrl + "/post", post, {headers: new HttpHeaders({'Content-Type':  'application/json'})})
      .subscribe(post => {
        // this.gs.log("created a post in createAPost", post);
        res(post);
      }, err => {
        // this.gs.log("err in createAPost", err);
        rej(err);
      });
    });
  }

  getAllPostsByTopicId(topicId: string) {
    return new Promise<Post[]> ((resolve, reject) => {
      var str = '/post/topic/' + topicId;
      this.http.get<Post[]>(this.backendUrl + str)
      .subscribe(
        posts => {resolve(posts);}, 
        err => {reject(err);}
      );
    });
  }
}

export interface Course {
  _id: string,
  courseCode: string,
  courseName: string,
  topics: [Topic]
}

export interface Topic {
  _id: string,
  name: string
}

export interface Post {
  _id?: string,
	topicId: string,
	subject: string,
	content: string,
	postedWhen?: any,
	postedBy: string,
	isResolved?: boolean
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