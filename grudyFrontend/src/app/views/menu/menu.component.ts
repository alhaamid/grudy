import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../../services/globals.service';
import { AuthService } from '../../services/auth.service';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  yourAccountTitle: string = "Account Details";
  dashboardTitle: string = "Dashboard"

  constructor(public rs: RoutingService, public gs: GlobalsService, public authService: AuthService) { }

  ngOnInit() {
  }

}
