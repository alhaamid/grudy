import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-your-account',
  templateUrl: './your-account.component.html',
  styleUrls: ['./your-account.component.css']
})
export class YourAccountComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
