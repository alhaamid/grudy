import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalsService } from './globals.service';
import { Injectable } from '@angular/core';
import { AuthService, User } from './auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutingService } from './routing.service';
import { GrudyService } from './grudy.service';

export interface CanComponentDeactivate<T> {
  canDeactivate (component: T): Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private gs: GlobalsService, 
    private rs: RoutingService, private afs: AngularFirestore, private grudy: GrudyService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      // if current url is signup or login and user is already logged in, then navigate to dashboard
      if (state.url == this.rs.LOGIN_PAGE.ROUTE || state.url == this.rs.SIGNUP_PAGE.ROUTE) {
        this.gs.log("this page shouldn't be accessed when logged in")
        resolve(false);
        this.router.navigate(this.rs.LANDING_PAGE.NAV);
      } else {
        if (this.authService.isLoggedIn()) {
          this.gs.log("auth-gard: already logged in");
          resolve(true);
        } else {
          this.authService.authState.subscribe( (user) => {
            if (user) {
              if (user.emailVerified) {
                // this.gs.IN_PROGRESS = true;
                this.authService.userDetailsObservable = this.afs.doc<User>(`${this.gs.USERS_COLLECTION}/${user.email}`).valueChanges();
                this.authService.userDetailsObservable.subscribe(response => {
                  this.authService.userDetails = response;
  
                  // check if the user is in our database
                  this.grudy.getAUser(user.email)
                  .then(__ => {
                    // this.gs.IN_PROGRESS = false;
                    this.authService.userInBackendDatabase = true;
                    this.gs.log("auth-guard: user is verified");
                    resolve(true);
                  })
                  .catch(__ => {
                    // this.gs.IN_PROGRESS = false;
                    // user is not in our backend database
                    resolve(false);
                    this.gs.log("auath-guard: user is in the firestore database but not in our backend database");
                    if (!(this.router.url === this.rs.LOGIN_PAGE.ROUTE)) {
                      this.router.navigate(this.rs.LOGIN_PAGE.NAV);
                    }
                  });
                })
              } else {
                resolve(false);
                this.gs.log("auath-guard: user is in the database but not verified");
                if (!(this.router.url === this.rs.LOGIN_PAGE.ROUTE)) {
                  this.router.navigate(this.rs.LOGIN_PAGE.NAV);
                }
              }
            } else {
              // this.gs.IN_PROGRESS = false;
              this.authService.userDetailsObservable = null;
              this.gs.log("auth-guard: user is logged out");
              if (!(this.router.url === this.rs.LOGIN_PAGE.ROUTE)) {
                this.router.navigate(this.rs.LOGIN_PAGE.NAV);
              }
              resolve(false);
            }
          });
        }
      }
    })
  }
}
