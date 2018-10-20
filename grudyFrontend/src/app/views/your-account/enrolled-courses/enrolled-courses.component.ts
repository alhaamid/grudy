import { Component, OnInit } from '@angular/core';
import { Course, GrudyService } from 'src/app/services/grudy.service';
import { AuthService } from 'src/app/services/auth.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-enrolled-courses',
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.css']
})
export class EnrolledCoursesComponent implements OnInit {
  allEnrolledCourses: Course[] = null;
  checkedCourses: boolean = false;

  constructor(private grudy: GrudyService, private authService: AuthService, private rs: RoutingService) {
    this.getAllUsersCourses();
  }

  getAllUsersCourses() {
    this.allEnrolledCourses = [];
    this.grudy.getAUser(this.authService.userDetails.email)
    .then(user => {
      this.checkedCourses = true;
      let allCourseCodes = user.courses;
      for (let courseCode of allCourseCodes) {
        this.grudy.getACourse(courseCode)
        .then(course => {
          this.allEnrolledCourses.push(course);
        })
        .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
  }

  ngOnInit() {
  }

}
