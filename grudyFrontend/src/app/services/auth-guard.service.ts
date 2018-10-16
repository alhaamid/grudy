import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalsService } from './globals.service';
import { Injectable } from '@angular/core';
import { AuthService, User } from './auth.service';
import { Router, CanActivate } from '@angular/router';
import { of } from 'rxjs';
import { RoutingService } from './routing.service';
import { GrudyService } from './grudy.service';

@Injectable()
export class AuthGuardService {

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private gs: GlobalsService, 
    private rs: RoutingService, private afs: AngularFirestore, private grudy: GrudyService) { }

  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
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

                this.grudy.getAUser(user.email)
                .then(__ => {
                  // this.gs.IN_PROGRESS = false;
                  this.authService.userInBackendDatabase = true;
                  this.gs.log("auth-guard: user is verified");
                  resolve(true);
                })
                .catch(__ => {
                  // this.gs.IN_PROGRESS = false;
                  resolve(false);
                  this.gs.log("auath-guard: user is in the database but not verified");
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
    })
  }
}
