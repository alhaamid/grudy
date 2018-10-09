import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  public LANDING_PAGE = new PageDetails('', '/', ['']);
  public LOGIN_PAGE = new PageDetails('login', '/login', ['login']);
  public YOUR_ACCOUNT_PAGE = new PageDetails('your-account', '/your-account', ['your-account']);
  public SIGNUP_PAGE = new PageDetails('sign-up', '/sign-up', ['sign-up']);

  constructor() { }
}

class PageDetails {
  constructor (public STR: string, public ROUTE: string, public NAV: string[]) {}
}