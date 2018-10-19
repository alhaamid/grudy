import { Component, OnInit } from '@angular/core';
import { GrudyService } from '../../services/grudy.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private grudy: GrudyService, private authService: AuthService) {
    // this.grudy.enrollUser(this.authService.userDetails.email, "CS 6476")
    // .then(val => {console.log(val);})
    // .catch(err => {console.log("got error in enrollUser", err);});

    // this.grudy.getAUser('haamid@gatech.edu')
    // .then(val => {console.log(val);})
    // .catch(err => {console.log("got error in getAUser", err);});
    // this.grudy.getAllOfferedCourses();
    // this.grudy.getACourse("CS 1100");
    // this.grudy.getACourse('CS 6476')
    // .then(val => {console.log(val);})
    // .catch(err => {console.log("got error in getACourse", err);});
  }

  ngOnInit() {
  }

}
