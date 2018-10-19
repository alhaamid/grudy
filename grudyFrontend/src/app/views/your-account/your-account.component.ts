import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GrudyService, Course } from 'src/app/services/grudy.service';

@Component({
  selector: 'app-your-account',
  templateUrl: './your-account.component.html',
  styleUrls: ['./your-account.component.css']
})
export class YourAccountComponent implements OnInit {
  allEnrolledCourses: Course[] = null;

  constructor(private grudy: GrudyService, private authService: AuthService) {
    this.allEnrolledCourses = [];
    this.getAllUsersCourses();
  }

  getAllUsersCourses() {
    this.grudy.getAUser(this.authService.userDetails.email)
    .then(user => {
      let allCourseCodes = user.courses;
      for (let courseCode of allCourseCodes) {
        this.grudy.getACourse(courseCode)
        .then(course => this.allEnrolledCourses.push(course))
        .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
  }

  ngOnInit() {
  }

}
