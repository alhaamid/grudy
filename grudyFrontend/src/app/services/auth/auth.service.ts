import { GlobalsService } from '../globals/globals.service';
import { Injectable } from '@angular/core';
import { User } from "../../models/User";
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { GrudyService } from '../grudy/grudy.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authState: Observable<firebase.User>;
  public userDetailsObservable: Observable<User> = null;
  public userDetails: User = null;
  public userInBackendDatabase: boolean = false;

  constructor(public afa: AngularFireAuth, private afs: AngularFirestore, private gs: GlobalsService, private grudy: GrudyService) {
    this.setupUserObservable().catch(err => {});
  }

  setupUserObservable() {
    return new Promise((resolve, reject) => {
      this.authState = this.afa.authState;
      this.authState.subscribe(user => {
        if (user) {
          if (user.emailVerified) {
            this.userDetailsObservable = this.afs.doc<User>(`${this.gs.USERS_COLLECTION}/${user.email}`).valueChanges();
            this.userDetailsObservable.subscribe(res => {
              this.userDetails = res;

              this.grudy.getAUser(user.email)
              .then(__ => {
                this.userInBackendDatabase = true;
                resolve();
              })
              .catch(__ => {
                reject(this.gs.ERR_USER_NOT_BACKEND_DB);
                this.userDetailsObservable = null;
                this.userInBackendDatabase = false;
                this.userDetails = null;
              });
            });
          } else {
            reject(this.gs.ERR_USER_NOT_VERIFIED)
          }
        } else {
          this.userDetailsObservable = null;
          reject(this.gs.ERR_USER_LOGGED_OUT);
        }
      });
    });
  }

  initializeUserData(email: string, name: string, password: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`${this.gs.USERS_COLLECTION}/${email}`);

    const data: User = {
      displayName: name,
      email: email,
      password: password,
      photoURL: this.gs.DEFAULT_PICTURE,
      courses: []
    }
    return userRef.set(data);
  }

  signUp(name: string, email: string, password: string) {
    return new Promise<any> ((resolve, reject) => {
      this.afa.auth.createUserWithEmailAndPassword(email, password)
      .then(val => {
        this.initializeUserData(email, name, password);
        this.afa.auth.currentUser.sendEmailVerification()
        .then(__ => {
          // a new user is created on Firestore and verification email is sent here
          
          // create a user in our own database
          this.grudy.createAUser(email, password, name, this.gs.DEFAULT_PICTURE)
          .then(user => { this.userInBackendDatabase = true; this.gs.log("new user at our backend created at signup"); })
          .catch(err => { this.gs.log("some error in creating user on the backend", err); })

          resolve({code: "verification-email-sent", message: "Please verify your email and then login"});
        })
        .catch(err => {
          reject(err);
        })
      })
      .catch(err => {
        // user is already created on Firestore but has not been verified yet
        if (!this.afa.auth && this.afa.auth.currentUser.emailVerified) {

          // if for some reason, the user wasn't created at signup, create one now
          this.grudy.createAUser(email, password, name, this.gs.DEFAULT_PICTURE)
          .then(user => { this.userInBackendDatabase = true; this.gs.log("new user at our backend created at signup"); })
          .catch(err => { this.gs.log("some error in creating user on the backend", err); })

          resolve({code: "verification-email-sent", message: "Please verify your email and then login"});
        } else {
          reject(err);
        }
      })
    })
  }

  logIn(email: string, password: string) {
    return new Promise<any> ((resolve, reject) => {
      this.afa.auth.signInWithEmailAndPassword(email, password)
      .then(val => {
        if (!val.user.emailVerified) {
          resolve({code: "verification-email-sent", message: "Please verify your email and then login"});
        } else {

          // make sure that the user logs in only if the user exists in our backend
          this.grudy.getAUser(email)
          .then(user => { resolve(user); this.userInBackendDatabase = true;})
          .catch(err => {
            resolve({code: "user-not-in-our-backend", message: "Please signup again and then login"});
          });
        }
      })
      .catch(err => {
        reject(err);
      })
    })
  }

  isLoggedIn() {
    return this.userDetails != null && this.userInBackendDatabase;
  }
  
  logout() {
    this.userDetailsObservable = null;
    this.userDetails = null;
    this.gs.log("logged out");
    this.afa.auth.signOut();
  }
}