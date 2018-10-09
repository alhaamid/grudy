import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  public APP_NAME: string = 'Grudy';
  public IN_PROGRESS: boolean = false;
  private DEBUG: boolean = true;

  public USERS_COLLECTION: string = 'users';

  constructor() { }

  public log(...a) {
    if (this.DEBUG) console.log(...a);
  }
}
