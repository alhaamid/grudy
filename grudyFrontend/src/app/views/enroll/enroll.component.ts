import { Component, OnInit } from '@angular/core';
import { GrudyService } from 'src/app/services/grudy/grudy.service';
import { Course } from "../../models/Course";
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css']
})
export class EnrollComponent implements OnInit {
  selectedCourseId = null;
  rForm: FormGroup;
  unenrolledCourses: Course[] = [];

  enrolledSuccessfully: number = 0;
  enrollErr = null;

  constructor(private grudy: GrudyService, private authService: AuthService, private fb: FormBuilder, private gs: GlobalsService) {
    this.rForm = fb.group({
      'enrollmentValidation': ['', Validators.compose([Validators.required])]
    });
    this.setupUnenrolledCourses();
  }

  setupUnenrolledCourses() {
    this.grudy.getUsersCourses(this.authService.userDetails.email)
    .then(enrolledCourses => {
      let enrolledCourseIds = enrolledCourses.map(course => course._id);
      this.unenrolledCourses = this.grudy.listOfCourses.filter(course => enrolledCourseIds.indexOf(course._id) < 0);
      this.gs.sortOn(this.unenrolledCourses, "courseCode", false);
      this.rForm.reset();
    })
    .catch(err => {
      console.log(err);
    })
  }

  enroll() {
    this.grudy.enrollACourse(this.authService.userDetails.email, this.selectedCourseId)
    .then(user => {
      this.enrolledSuccessfully = 1;
      this.setupUnenrolledCourses();
    })
    .catch(err => {
      this.enrollErr = err["error"];
      this.enrolledSuccessfully = 2;
    });
  }

  ngOnInit() {
  }

}
