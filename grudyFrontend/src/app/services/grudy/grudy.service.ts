import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/User';
import { GlobalsService } from '../globals/globals.service';
import { Course } from "../../models/Course";
import { Post } from "../../models/Post";
import { Discussion } from "../../models/Discussion";

@Injectable({
  providedIn: 'root'
})
export class GrudyService {
  private backendUrl: string = "http://localhost:4201";
  public listOfCourses: Course[] = null;
  private headerObj = {headers: new HttpHeaders({'Content-Type':  'application/json'})};

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

  createAUser(user: User) {
    return new Promise<User> ((res, rej) => {
      this.http.post<User>(this.backendUrl + "/user", user, this.headerObj)
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
      this.http.post<User>(this.backendUrl + `/user/${email}/enroll/${id}`, {}, this.headerObj)
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
      this.http.delete<User>(this.backendUrl + `/user/${email}/drop/${id}`, this.headerObj)
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
  createAPost(post: Post) {
    return new Promise<Post> ((res, rej) => {
      this.http.post<Post>(this.backendUrl + "/post", post, this.headerObj)
      .subscribe(post => {
        // this.gs.log("created a post in createAPost", post);
        res(post);
      }, err => {
        // this.gs.log("err in createAPost", err);
        rej(err);
      });
    });
  }

  deleteAPost(postId: string) {
    return new Promise<Post> ((res, rej) => {
      this.http.delete<Post>(`${this.backendUrl}/post/${postId}`)
      .subscribe(
        post => {res(post);}, 
        err => {rej(err);}
      );
    });
  }

  updateAPost(postId: string, update: {}) {
    return new Promise<Post>((res, rej) => {
      this.http.put<Post>(`${this.backendUrl}/post/${postId}`, update, this.headerObj)
      .subscribe(
        post => {res(post);}, 
        err => {rej(err);}
      );
    });
  }


  addADiscussion(postId: string, discussion: Discussion) {
    return new Promise<Post> ((res, rej) => {
      this.http.post<Post>(this.backendUrl + `/post/${postId}/discussion`, discussion, this.headerObj)
      .subscribe(discussion => {
        res(discussion);
      }, err => {
        rej(err);
      });
    });
  }

  deleteADiscussion(postId: string, discussionId: string) {
    return new Promise<Post> ((res, rej) => {
      this.http.delete<Post>(`${this.backendUrl}/post/${postId}/discussion/${discussionId}`)
      .subscribe(
        post => {res(post);}, 
        err => {rej(err);}
      );
    });
  }

  updateADiscussion(postId: string, discussionId: string, discussion: Discussion) {
    return new Promise<Post>((res, rej) => {
      this.http.put<Post>(`${this.backendUrl}/post/${postId}/discussion/${discussionId}`, discussion, this.headerObj)
      .subscribe(
        post => {res(post);}, 
        err => {rej(err);}
      );
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

  search(topicId: string, method: string, query: string) {
    return new Promise<Post[]> ((resolve, reject) => {
      var str = `/post/search/subject/${topicId}/${method}/${query}`;
      this.http.get<Post[]>(this.backendUrl + str)
      .subscribe(
        posts => {resolve(posts);}, 
        err => {reject(err);}
      );
    })
  }

  getUsersPosts(email: string) {
    return new Promise<Post[]> ((resolve, reject) => {
      var str = `/post/user/${email}`;
      this.http.get<Post[]>(this.backendUrl + str)
      .subscribe(
        posts => {resolve(posts);}, 
        err => {reject(err);}
      );
    })
  }
}