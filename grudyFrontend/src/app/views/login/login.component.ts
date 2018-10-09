import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GlobalsService } from '../../services/globals.service';
import { RoutingService } from '../../services/routing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailPlaceholder: string = 'Email';
  passwordPlaceholder: string = 'Password';

  email: string = "haamid@gatech.edu";
  password: string = "haamid@gatech.edu";

  minEmailLength = 5;
  minPasswordLength = 5;

  verificationEmailSent: boolean = false;
  noSuchUser: boolean = false;

  rForm: FormGroup;
  
  constructor(private fb: FormBuilder, private authService: AuthService, private gs: GlobalsService, private router: Router, private rs: RoutingService) { 

    this.rForm = fb.group({
      'emailValidation': ['', Validators.compose([
        Validators.required, Validators.minLength(this.minEmailLength)
      ])],
      'passwordValidation': ['', Validators.compose([
        Validators.required, Validators.minLength(this.minPasswordLength)
      ])]
    })
  }

  logIn() {
    this.authService.logIn(this.email, this.password)
    .then(val => {
      if (val.hasOwnProperty("code")) {
        this.verificationEmailSent = val["code"] === "verification-email-sent";
        this.noSuchUser = !this.verificationEmailSent;
      } else {
        this.router.navigate(this.rs.LANDING_PAGE.NAV);
      }
    })
    .catch(err => {
      this.noSuchUser = err["code"] === "auth/user-not-found";
      this.verificationEmailSent = !this.noSuchUser;
    });
  }

  ngOnInit() {
  }

}