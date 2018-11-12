import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { MenuComponent } from './views/menu/menu.component';
import { YourAccountComponent } from './views/your-account/your-account.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { ProfileComponent } from './views/your-account/profile/profile.component';
import { EnrollComponent } from './views/enroll/enroll.component';
import { DropComponent } from './views/drop/drop.component';
import { EnrolledCoursesComponent } from './views/your-account/enrolled-courses/enrolled-courses.component';

import { AuthService } from './services/auth/auth.service';
import { GlobalsService } from './services/globals/globals.service';
import { RoutingService } from './services/routing/routing.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { GrudyService } from './services/grudy/grudy.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SearchComponent } from './views/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MenuComponent,
    YourAccountComponent,
    SignUpComponent,
    EnrollComponent,
    ProfileComponent,
    DropComponent,
    EnrolledCoursesComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    AngularFireModule.initializeApp(environment.config),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule
  ],
  providers: [
    GlobalsService, AuthService, RoutingService, AuthGuardService, GrudyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
