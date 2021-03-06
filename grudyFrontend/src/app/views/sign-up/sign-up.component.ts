import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { GlobalsService } from '../../services/globals/globals.service';
import { RoutingService } from '../../services/routing/routing.service';

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

  resolveMessage: string = "";
  rejectMessage: string = "";
  
  constructor(private fb: FormBuilder, private authService: AuthService, private gs: GlobalsService, private rs: RoutingService) { 

    this.rForm = fb.group({
      'emailValidation': ['', Validators.compose([
        Validators.required, Validators.minLength(this.minEmailLength), Validators.pattern('^[A-Za-z0-9._%+-]+@gatech.edu$')
      ])],
      'passwordValidation': ['', Validators.compose([
        Validators.required, Validators.minLength(this.minPasswordLength)
      ])],
      'nameValidation': ['', Validators.compose([
        Validators.required, Validators.minLength(this.minPasswordLength)
      ])]
    });

  }

  signUp() {
    this.authService.signUp(this.name, this.email, this.password)
    .then(val => {
      this.resolveMessage = val["message"];
      this.rejectMessage = "";
    })
    .catch(err => {
      console.log("err", err);
      this.rejectMessage = err["message"];
      this.resolveMessage = "";
    });
  }

  ngOnInit() {
  }

}
