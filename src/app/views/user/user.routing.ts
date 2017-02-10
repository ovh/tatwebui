import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {UserSignUPComponent} from './signup/signup.component';
import {UserLoginComponent} from './login/login.component';

const routes: Routes = [
  {
    path: '',
    children : [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: UserLoginComponent },
      { path: 'signup', component: UserSignUPComponent }
    ]
  }
];

export const userRouting: ModuleWithProviders = RouterModule.forChild(routes);
