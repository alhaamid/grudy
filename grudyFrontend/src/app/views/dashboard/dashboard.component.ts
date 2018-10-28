import { Course } from "../../models/Course";
import { Post } from "../../models/Post";
import { Discussion } from "../../models/Discussion";
import { Topic } from "../../models/Topic";

import { Component, OnInit } from '@angular/core';
import { GrudyService } from '../../services/grudy/grudy.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/services/routing/routing.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';

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

  newPostVisibilityState: boolean = false;
  newPostForm: FormGroup;
  newPost: PostForm = null;

  newDiscussionsVisibilityState: { [id: string]: boolean } = {};
  newDiscussionsFormValids: { [id: string]: FormGroup } = {};
  newDiscussions: { [id: string]: DiscussionForm } = {};

  constructor(private grudy: GrudyService, private authService: AuthService, private fb: FormBuilder, private rs: RoutingService, private gs: GlobalsService) {
    this.newPost = this.getEmptyPost();

    this.grudy.getUsersCourses(this.authService.userDetails.email)
    .then(courses => {
      this.allEnrolledCourses = courses;
      this.checkedCourses = true;
      this.newPostForm = this.getAPostFormGroup();
    })
    .catch(err => console.log(err));
  }

  getAPostFormGroup(): FormGroup {
    return this.fb.group({
      'subjectValidation': [null, Validators.required],
      'contentValidation': [null, Validators.required]
    })
  }

  getADiscussionFormGroup(): FormGroup {
    return this.fb.group({
      'subjectValidation': [null, Validators.required],
      'contentValidation': [null, Validators.required]
    })
  }

  getEmptyPost(): PostForm {
    return {
      subject: "hello",
      content: "world",
      isResolved: false
    };
  }

  getEmptyDiscussion(): DiscussionForm {
    return {
      subject: "hello",
      content: "world",
    };
  }

  setNewPostState(newState: boolean) {
    this.newPostVisibilityState = newState;
  }

  courseChange() {
    let result = this.allEnrolledCourses.filter(course => course._id === this.selectedCourseId);
    if (result.length > 0) {
      this.selectedTopics = result[0].topics;
      this.checkedTopics = true;
    } else {
      this.selectedTopics = null;
      this.checkedTopics = null;
      console.log("selected course id is not in user's courses");
    }
  }

  refreshPosts() {
    return new Promise<Boolean>((res, rej) => {
      this.grudy.getAllPostsByTopicId(this.selectedTopicId)
      .then(posts => {
        this.selectedPosts = posts;
        this.gs.sortOn(this.selectedPosts, "postedWhen", true);

        // update selected post in case a discussion was added
        this.resetSelectedPost();
        this.checkedPosts = true;

        posts.forEach(post => {
          if (!(this.newDiscussionsFormValids.hasOwnProperty(post._id))) {
            this.newDiscussionsFormValids[post._id] = this.getADiscussionFormGroup();
          }

          if (!(this.newDiscussionsVisibilityState.hasOwnProperty(post._id))) {
            this.newDiscussionsVisibilityState[post._id] = false;
          }

          if (!(this.newDiscussions.hasOwnProperty(post._id))) {
            this.newDiscussions[post._id] = this.getEmptyDiscussion();
          }
        });

        res(true);
      })
      .catch(err => {
        console.log(err);
        res(false);
      });
    });
  }

  resetSelectedPost() {
    if (this.selectedPostId) {
      // reset your selected post
      let result = this.selectedPosts.filter(post => post._id == this.selectedPostId);
      if (result.length > 0) {
        this.selectedPost = result[0];
        this.gs.sortOn(this.selectedPost.discussions, "postedWhen", true);
      } else {
        this.selectedPost = null;
      }
    }
  }

  createAPost() {
    let tempPost: Post = {
      topicId: this.selectedTopicId,
      subject: this.newPost.subject,
      content: this.newPost.content,
      isResolved: this.newPost.isResolved,
      postedBy: this.authService.userDetails._id,
    }
    this.grudy.createAPost(tempPost)
    .then(newPost => {
      this.refreshPosts();
      this.setNewPostState(false);
      this.newPost = this.getEmptyPost();
    })
    .catch(err => console.log(err));
  }

  deleteSelectedPost() {
    this.grudy.deleteAPost(this.selectedPost._id)
    .then(oldPost => {
      this.refreshPosts();
    })
    .catch(err => console.log(err));
  }

  updatePost() {
    this.grudy.updateAPost(this.selectedPost._id, this.selectedPost)
    .then(newPost => {
      this.refreshPosts();
    })
    .catch(err => console.log(err));
  }

  cancelNewPost() {
    this.newPost = this.getEmptyPost();
    this.newPostVisibilityState = false;
  }



  createADiscussion() {
    let tempDiscussion: Discussion = {
      subject: this.newDiscussions[this.selectedPost._id].subject,
      content: this.newDiscussions[this.selectedPost._id].content,
      startedBy: this.authService.userDetails._id,
    }
    this.grudy.addADiscussion(this.selectedPost._id, tempDiscussion)
    .then(newPost => {
      // need to refresh the posts
      this.refreshPosts();
      this.newDiscussions[this.selectedPost._id] = this.getEmptyDiscussion();
      this.newDiscussionsVisibilityState[this.selectedPost._id] = false;
    })
    .catch(err => console.log(err));
  }

  deleteADiscussion(discussionId: string) {
    this.grudy.deleteADiscussion(this.selectedPost._id, discussionId)
    .then(newPost => {
      // need to refresh the posts
      this.refreshPosts();
      this.newDiscussionsVisibilityState[this.selectedPost._id] = false;
    })
    .catch(err => console.log(err));
  }

  cancelADiscussion() {
    this.newDiscussions[this.selectedPost._id] = this.getEmptyDiscussion();
    this.newDiscussionsVisibilityState[this.selectedPost._id] = false;
  }

  updateDiscussion(discussion: Discussion) {
    this.grudy.updateADiscussion(this.selectedPost._id, discussion._id, discussion)
    .then(newPost => {
      this.refreshPosts();
    })
    .catch(err => console.log(err));
  }

  showSelectedPostsDiscussion(bool: boolean) {
    this.newDiscussionsVisibilityState[this.selectedPost._id] = bool;
  }

  setPostAndDiscussions(post: Post) {
    this.selectedPost = post;
    this.selectedPostId = post._id;
    this.gs.sortOn(this.selectedPost.discussions, "postedWhen", true);
    /* update and sort relevant discussions when the a post selection changes */
  }


  ngOnInit() {
  }

  print(any) {
    console.log(any, this.selectedPost);
  }

}

interface PostForm {
  subject: string,
  content: string
  isResolved: boolean
}

interface DiscussionForm {
  subject: string,
  content: string
}


// temp() {
//   // this.grudy.enrollUser(this.authService.userDetails.email, "CS 6476")
//   // .then(val => {console.log(val);})
//   // .catch(err => {console.log("got error in enrollUser", err);});

//   // this.grudy.getAUser('haamid@gatech.edu')
//   // .then(val => {console.log(val);})
//   // .catch(err => {console.log("got error in getAUser", err);});
//   // this.grudy.getAllOfferedCourses();
//   // this.grudy.getACourse("5bcfb5c0a267d44bc44f484e")
//   // .then(val => {console.log(val);})
//   // .catch(err => {console.log("got error in getACourse", err);});
// }