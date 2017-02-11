import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {UserSignUPComponent} from './signup/signup.component';
import {UserLoginComponent} from './login/login.component';
import {UserVerifyComponent} from './verify/verify.component';
import {UserPasswordComponent} from './password/password.component';

const routes: Routes = [
  {
    path: '',
    children : [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: UserLoginComponent },
      { path: 'signup', component: UserSignUPComponent },
      { path: 'password', component: UserPasswordComponent },
      { path: 'verify/:username/:token', component: UserVerifyComponent }
    ]
  }
];

export const userRouting: ModuleWithProviders = RouterModule.forChild(routes);
