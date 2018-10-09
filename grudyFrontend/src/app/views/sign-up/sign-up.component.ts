import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GlobalsService } from '../../services/globals.service';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  namePlaceholder: string = 'Name';
  emailPlaceholder: string = 'Email';
  passwordPlaceholder: string = 'Password';

  name: string = "haamid"
  email: string = "haamid@gatech.edu";
  password: string = "haamid@gatech.edu";

  minNameLength = 5;
  minEmailLength = 5;
  minPasswordLength = 5;

  rForm: FormGroup;

  verificationEmailSent: boolean = false;
  alreadyInUse: boolean = false;
  
  constructor(private fb: FormBuilder, private authService: AuthService, private gs: GlobalsService, private rs: RoutingService) { 

    this.rForm = fb.group({
      'emailValidation': ['', Validators.compose([
        Validators.required, Validators.minLength(this.minEmailLength)
      ])],
      'passwordValidation': ['', Validators.compose([
        Validators.required, Validators.minLength(this.minPasswordLength)
      ])],
      'nameValidation': ['', Validators.compose([
        Validators.required, Validators.minLength(this.minPasswordLength)
      ])]
    })
  }

  signUp() {
    this.authService.signUp(this.name, this.email, this.password)
    .then(val => {
      // this.gs.log("val", val);
      this.verificationEmailSent = val["code"] === "verification-email-sent";
      this.alreadyInUse = !this.verificationEmailSent;
    })
    .catch(err => {
      // this.gs.log("err", err);
      this.alreadyInUse = err["code"] === "auth/email-already-in-use";
      this.verificationEmailSent = !this.alreadyInUse;
    });
  }

  ngOnInit() {
  }

}
