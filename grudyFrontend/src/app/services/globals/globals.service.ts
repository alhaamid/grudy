import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  public APP_NAME: string = 'Grudy';
  public IN_PROGRESS: boolean = false;
  private DEBUG: boolean = true;

  public USERS_COLLECTION: string = 'users';

  public ERR_USER_LOGGED_OUT: string = "User is logged out";
  public ERR_USER_NOT_VERIFIED: string = "User is not verified";
  public ERR_USER_NOT_BACKEND_DB: string = "User not in our backend database";

  constructor() { }

  public log(...a) {
    if (this.DEBUG) console.log(...a);
  }

  sortOn(array: any[], attribute: string, descending: boolean) {
    array.sort( (a, b) => {
      if (a[attribute] < b[attribute]) {
        return -1;
      } else if (a[attribute] > b[attribute]) {
        return 1;
      } else {
        return 0;
      }
    })
    if (descending) {
      array.reverse();
    };
  }
}
