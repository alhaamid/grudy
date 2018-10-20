import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../views/login/login.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { DashboardComponent } from '../views/dashboard/dashboard.component';
import { YourAccountComponent } from '../views/your-account/your-account.component';
import { SignUpComponent } from '../views/sign-up/sign-up.component';
import { EnrollComponent } from '../views/enroll/enroll.component';
import { DropComponent } from '../views/drop/drop.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'your-account',
    component: YourAccountComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'enroll',
    component: EnrollComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'drop',
    component: DropComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }