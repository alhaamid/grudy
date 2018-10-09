import { GlobalsService } from './globals.service';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authState: Observable<firebase.User>;
  public userDetailsObservable: Observable<FirestoreUser> = null;
  public userDetails: FirestoreUser = null;

  constructor(private afa: AngularFireAuth, private afs: AngularFirestore, private gs: GlobalsService) {
    this.authState = afa.authState;
    this.authState.subscribe(user => {
      if (user) {
        if (user.emailVerified) {
          console.log("email verified");
          this.userDetailsObservable = this.afs.doc<FirestoreUser>(`${this.gs.USERS_COLLECTION}/${user.uid}`).valueChanges();
          this.userDetailsObservable.subscribe(res => {
            this.userDetails = res;
          });
        }
      } else {
        console.log("email not verified");
        this.userDetailsObservable = null;
      }
    });
  }

  updateUserData(user: firebase.User, email: string, name: string, password: string) {
    const userRef: AngularFirestoreDocument<FirestoreUser> = this.afs.doc(`${this.gs.USERS_COLLECTION}/${user.uid}`);

    const data: FirestoreUser = {
      userId: user.uid,
      displayName: name,
      email: email,
      password: password,
      photoURL: "https://pbs.twimg.com/profile_images/582436192307703809/DqWJEB13_400x400.png",
    }
    return userRef.set(data);
  }

  signUp(name: string, email: string, password: string) {
    return new Promise<any> ((resolve, reject) => {
      this.afa.auth.createUserWithEmailAndPassword(email, password)
      .then(val => {
        this.updateUserData(val.user, email, name, password);
        this.afa.auth.currentUser.sendEmailVerification()
        .then(val => {
          resolve({code: "verification-email-sent", message: "Please verify your email and then login"});
        })
      })
      .catch(err => {
        if (!this.afa.auth && this.afa.auth.currentUser.emailVerified) {
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
          resolve(val.user);
        }
      })
      .catch(err => {
        reject(err);
      })
    })
  }

  isLoggedIn() {
    return this.userDetails != null;
  }
  
  logout() {
    this.userDetailsObservable = null;
    this.userDetails = null;
    this.gs.log("logged out");
    this.afa.auth.signOut();;
  }
}

export interface FirestoreUser {
  userId: string;
  displayName: string;
  email: string;
  password: string;
  photoURL?: string;
}