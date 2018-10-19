import { Component, OnInit } from '@angular/core';
import { GrudyService, Course } from 'src/app/services/grudy.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css']
})
export class EnrollComponent implements OnInit {
  selectedCourse = null;
  rForm: FormGroup;
  unenrolledCourses: Course[] = [];

  enrolledSuccessfully: number = 0;
  enrollErr = null;

  constructor(private grudy: GrudyService, private authService: AuthService, private fb: FormBuilder) {
    this.rForm = fb.group({
      'enrollmentValidation': ['', Validators.compose([Validators.required])]
    });
    this.setupUnenrolledCourses();
  }

  setupUnenrolledCourses() {
    this.grudy.getAUser(this.authService.userDetails.email)
    .then(user => {
      this.unenrolledCourses = this.grudy.listOfCourses.filter(course => user.courses.indexOf(course.courseCode) < 0);
    })
    .catch(err => {
      console.log(err);
    })
  }

  enroll() {
    this.grudy.enrollACourse(this.authService.userDetails.email, this.selectedCourse)
    .then(__ => {
      this.enrolledSuccessfully = 1;
      this.setupUnenrolledCourses();
    })
    .catch(err => {
      this.enrollErr = err["error"];
      this.enrolledSuccessfully = 2;
    });
  }

  updateSelectedStatus(val) {
    console.log(val);
  }

  ngOnInit() {
  }

}
