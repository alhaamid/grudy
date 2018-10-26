import { Component, OnInit } from '@angular/core';
import { GrudyService, Course, Topic, Post, Discussion } from '../../services/grudy.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  checkedCourses: boolean = false;
  checkedTopics: boolean = false;
  checkedPosts: boolean = false;
  
  allEnrolledCourses: Course[] = [];
  selectedCourseId: string = null;
  selectedTopics: Topic[] = null;
  selectedTopicId: string = null;
  selectedPosts: Post[] = []
  selectedPost: Post = null;
  selectedPostId: string = null;

  prevActivePost = null;

  constructor(private grudy: GrudyService, private authService: AuthService, private fb: FormBuilder, private rs: RoutingService) {
    this.temp();

    this.grudy.getUsersCourses(this.authService.userDetails.email)
    .then(courses => {
      this.allEnrolledCourses = courses;
      this.checkedCourses = true;
    })
    .catch(err => console.log(err));
  }

  courseChange() {
    let selectedCourse = this.allEnrolledCourses.filter(course => course._id === this.selectedCourseId)[0];
    this.selectedTopics = selectedCourse.topics;
    this.checkedTopics = true;
  }

  topicChange() {
    this.grudy.getAllPostsByTopicId(this.selectedTopicId)
    .then(posts => {
      this.selectedPosts = posts;
      this.sortOn(this.selectedPosts, "postedWhen", true);

      if (this.selectedPostId) {
        // reset your selected post
        let result = this.selectedPosts.filter(post => post._id == this.selectedPostId);
        if (result.length > 0) {
          this.selectedPost = result[0];
          this.sortOn(this.selectedPost.discussions, "postedWhen", true);
        } else {
          this.selectedPost = null;
        }
      }

      this.checkedPosts = true;
    })
    .catch(err => console.log(err));
  }

  sortOn(array: any[], attribute: string, descending: boolean) {
    array.sort( (a, b) => {
      if (a[attribute] < b[attribute]) {
        return -1;
      } else if (a[attribute] > b[attribute]) {
        return 1;
      } else {
        return 0;
      }
    })
    if (descending) {
      array.reverse();
    };
  }

  createAPost() {
    let tempPost: Post = {
      topicId: this.selectedTopicId,
      subject: "Post subject",
      content: `
        What is going on over here. I am waiting for your answer as this is getting absolutely ridiculous.
        Do you really think I will put up with this after what you have done?
        Maybe I will. I dont know. I will have to think about it.
      `,
      postedBy: this.authService.userDetails.email,
      discussions: []
    }
    this.grudy.createAPost(tempPost)
    .then(newPost => {
      this.topicChange()
    })
    .catch(err => console.log(err));
  }

  createADiscussion() {
    let tempDiscussion: Discussion = {
      subject: "discussion subject",
      content: "discussion content",
      startedBy: this.authService.userDetails.email,
    }
    this.grudy.createADiscussion(this.selectedPost._id, tempDiscussion)
    .then(newPost => {
      // need to refresh the posts
      this.topicChange();
    })
    .catch(err => console.log(err));
  }

  setPostAndDiscussions(post: Post) {
    this.selectedPost = post;
    this.selectedPostId = post._id;
    this.sortOn(this.selectedPost.discussions, "postedWhen", true);
    /* update and sort relevant discussions when the a post selection changes */
  }

  temp() {
    // this.grudy.enrollUser(this.authService.userDetails.email, "CS 6476")
    // .then(val => {console.log(val);})
    // .catch(err => {console.log("got error in enrollUser", err);});

    // this.grudy.getAUser('haamid@gatech.edu')
    // .then(val => {console.log(val);})
    // .catch(err => {console.log("got error in getAUser", err);});
    // this.grudy.getAllOfferedCourses();
    // this.grudy.getACourse("5bcfb5c0a267d44bc44f484e")
    // .then(val => {console.log(val);})
    // .catch(err => {console.log("got error in getACourse", err);});
  }

  ngOnInit() {
  }

}
