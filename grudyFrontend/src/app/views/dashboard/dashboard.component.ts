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

  postEditState: { [id: string]: boolean } = {};
  postFormValids: { [id: string]: FormGroup } = {};

  searchMode: boolean = false;
  searchMethods: string[] = ["search by content", "search by user"];
  selectedSearchMethod: string = this.searchMethods[0];
  searchFormGroup: FormGroup = null;
  searchQuery: string = "HelloWorld";
  searched: boolean = false;

  constructor(private grudy: GrudyService, private authService: AuthService, private fb: FormBuilder, private rs: RoutingService, private gs: GlobalsService) {
    this.newPost = this.getEmptyPost();

    this.grudy.getUsersCourses(this.authService.userDetails.email)
    .then(courses => {
      this.allEnrolledCourses = courses;
      this.checkedCourses = true;
      this.newPostForm = this.getAPostFormGroup();
      this.searchFormGroup = this.fb.group({
        'searchValidation': [null, Validators.required],
      })
    })
    .catch(err => console.log(err));
  }

  refreshPosts() {
    if (!this.searchMode) {
      this.grudy.getAllPostsByTopicId(this.selectedTopicId)
      .then(posts => {
        this.processPosts(posts);
      })
      .catch(err => {console.log(err);});
    } else {
      this.search()
      .then(posts => {
        this.processPosts(posts);
      })
      .catch(err => {console.log(err);});
    }
  }

  processPosts(posts: Post[]) {
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

      if (!(this.postEditState.hasOwnProperty(post._id))) {
        this.postEditState[post._id] = false;
      }

      if (!(this.postFormValids.hasOwnProperty(post._id))) {
        this.postFormValids[post._id] = this.getAPostFormGroup();
      }

      post.discussions.forEach(discussion => {
        if (!(this.postEditState.hasOwnProperty(discussion._id))) {
          this.postEditState[discussion._id] = false;
        }

        if (!(this.postFormValids.hasOwnProperty(discussion._id))) {
          this.postFormValids[discussion._id] = this.getADiscussionFormGroup();
        }

      })
    });
  }

  setPostEditState(postId: string, bool: boolean) {
    this.postEditState[postId] = bool;
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
      subject: "",
      content: "",
      isResolved: false
    };
  }

  getEmptyDiscussion(): DiscussionForm {
    return {
      subject: "",
      content: "",
    };
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

  resetSelectedPost() {
    if (this.selectedPostId) {
      // reset your selected post
      let result = this.selectedPosts.filter(post => post._id == this.selectedPostId);
      if (result.length > 0) {
        this.selectedPost = result[0];
        this.gs.sortOn(this.selectedPost.discussions, "postedWhen", false);
      } else {
        this.selectedPost = null;
      }
    }
  }

  createAPost() {
    let tempPost: Post = {
      course: this.selectedCourseId,
      topicId: this.selectedTopicId,
      subject: this.newPost.subject,
      content: this.newPost.content,
      isResolved: this.newPost.isResolved,
      postedBy: this.authService.userDetails._id,
    }
    this.grudy.createAPost(tempPost)
    .then(newPost => {
      this.refreshPosts();
      this.hideNewPostForm();
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

  updateAPost(postId: string, post: Post) {
    this.grudy.updateAPost(postId, post)
    .then(newPost => {
      this.refreshPosts();
    })
    .catch(err => console.log(err));
  }

  showNewPostForm() {
    this.newPostVisibilityState = true;
  }

  hideNewPostForm() {
    this.newPost = this.getEmptyPost();
    this.newPostVisibilityState = false;
  }

  search() {
    return new Promise<Post[]> ((resolve, reject) => {
      let encodedQuery = encodeURI(this.searchQuery);
      this.grudy.search(this.selectedTopicId, this.selectedSearchMethod, encodedQuery)
      .then(posts => {
        this.searched = true;
        this.selectedPosts = posts;
        resolve(posts);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
    });
  }

  searchModeChange(mode){
    if (!mode) {
      this.refreshPosts();
    }
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
    this.gs.sortOn(this.selectedPost.discussions, "postedWhen", false);
  }


  ngOnInit() {
  }

  print(any) {
    console.log(any);
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