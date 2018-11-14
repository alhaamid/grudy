import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { GrudyService } from 'src/app/services/grudy/grudy.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-your-account',
  templateUrl: './your-account.component.html',
  styleUrls: ['./your-account.component.css']
})
export class YourAccountComponent implements OnInit {
  constructor() {
    
  }

  ngOnInit() {
  }

}
