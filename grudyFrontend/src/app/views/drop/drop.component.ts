import { Component, OnInit } from '@angular/core';
import { Course, GrudyService } from 'src/app/services/grudy/grudy.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-drop',
  templateUrl: './drop.component.html',
  styleUrls: ['./drop.component.css']
})
export class DropComponent implements OnInit {

  allEnrolledCourses: Course[] = null;
  checkedCourses: boolean = false;

  constructor(private grudy: GrudyService, private authService: AuthService, private gs: GlobalsService) {
    this.getAllUsersCourses();
  }

  getAllUsersCourses() {
    this.grudy.getUsersCourses(this.authService.userDetails.email)
    .then(courses => {
      this.allEnrolledCourses = courses;
      this.gs.sortOn(this.allEnrolledCourses, "courseCode", false);
      this.checkedCourses = true;
    })
    .catch(err => console.log(err))
    // this.allEnrolledCourses = [];
    // this.grudy.getAUser(this.authService.userDetails.email)
    // .then(user => {
    //   this.checkedCourses = true;
    //   let allCourseCodes = user.courses;
    //   for (let courseCode of allCourseCodes) {
    //     this.grudy.getACourse(courseCode)
    //     .then(course => {
    //       this.allEnrolledCourses.push(course);
    //     })
    //     .catch(err => console.log(err));
    //   }
    // })
    // .catch(err => console.log(err));
  }

  dropCourse(id: string) {
    this.grudy.dropACourse(this.authService.userDetails.email, id)
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
