import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  public APP_NAME: string = 'Grudy';
  public IN_PROGRESS: boolean = false;
  private DEBUG: boolean = true;

  public USERS_COLLECTION: string = 'users';

  public DEFAULT_PICTURE: string = "https://pbs.twimg.com/profile_images/582436192307703809/DqWJEB13_400x400.png";

  constructor() { }

  public log(...a) {
    if (this.DEBUG) console.log(...a);
  }
}
