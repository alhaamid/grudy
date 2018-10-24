import { Component, OnInit } from '@angular/core';
import { GrudyService, Course, Topic } from '../../services/grudy.service';
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
  
  allEnrolledCourses: Course[] = [];
  selectedCourseId: string = null;
  selectedTopics: Topic[] = null;
  selectedTopicId: string = null;

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
    console.log(this.selectedTopicId);
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
