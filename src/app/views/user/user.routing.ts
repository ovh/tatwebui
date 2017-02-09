import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {
    path: '',
    children : [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent }
    ]
  }
];

export const userRouting: ModuleWithProviders = RouterModule.forChild(routes);
