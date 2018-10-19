import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GrudyService, Course } from 'src/app/services/grudy.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-your-account',
  templateUrl: './your-account.component.html',
  styleUrls: ['./your-account.component.css']
})
export class YourAccountComponent implements OnInit {
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

  dropCourse(courseCode: string) {
    this.grudy.dropACourse(this.authService.userDetails.email, courseCode)
    .then(__ => {
      this.getAllUsersCourses();
    })
    .catch(err => {
      console.log(err);
    });
  }

  ngOnInit() {
  }

}
