import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { GlobalsService } from './services/globals.service';
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
  }
}
