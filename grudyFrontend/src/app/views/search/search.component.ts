import { Component, OnInit } from '@angular/core';
import { GrudyService } from 'src/app/services/grudy/grudy.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/services/routing/routing.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';

import { Course } from "../../models/Course";
import { Post } from "../../models/Post";
import { Discussion } from "../../models/Discussion";
import { Topic } from "../../models/Topic";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  allEnrolledCourses: Course[] = [];
  checkedCourses: boolean = false;
  checkedTopics: boolean = false;

  selectedCourseId: string = null;
  selectedTopics: Topic[] = null;
  selectedTopicId: string = null;

  searchMethods: string[] = ["search in posts' content"];
  selectedSearchMethod: string = this.searchMethods[0];
  searchFormGroup: FormGroup = null;
  searchQuery: string = "HelloWorld";

  searchResultPosts: Post[] = [];
  selectedPost: Post = null;
  selectedPostId: string = null;
  searched: boolean = false;

  constructor(private grudy: GrudyService, private authService: AuthService, private fb: FormBuilder, private rs: RoutingService, private gs: GlobalsService) {
    
    this.grudy.getUsersCourses(this.authService.userDetails.email)
    .then(courses => {
      this.allEnrolledCourses = courses;
      this.checkedCourses = true;
      this.searchFormGroup = this.fb.group({
        'searchValidation': [null, Validators.required],
      })
    })
    .catch(err => console.log(err));
  }

  setPostAndDiscussions(post: Post) {
    this.selectedPost = post;
    this.selectedPostId = post._id;
    this.gs.sortOn(this.selectedPost.discussions, "postedWhen", true);
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

  search() {
    // console.log(this.selectedSearchMethod, this.searchQuery);
    let encodedQuery = encodeURI(this.searchQuery);
    this.grudy.search(this.selectedTopicId, this.selectedSearchMethod, encodedQuery)
    .then(posts => {
      this.searched = true;
      this.searchResultPosts = posts;
    })
    .catch(err => {
      console.log(err);
    })
  }

  ngOnInit() {
  }

}
