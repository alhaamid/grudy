import { Component, OnInit } from '@angular/core';
import { GrudyService } from '../../services/grudy.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private grudy: GrudyService) {
    // this.grudy.getAllCourses();
    // this.grudy.getACourse("5bc00f507e4af16ad20fd5bc");
    // this.grudy.getAUser('haamid@gatech.edu').catch(err => {
    //   console.log("got error in dashboard", err);
    // });
  }

  ngOnInit() {
  }

}
