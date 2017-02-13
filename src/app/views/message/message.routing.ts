import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {MessageComponent} from './message.component';
import {CanActivateAuthRoute} from '../../service/auth/canActivateAuthRoute';

const routes: Routes = [
  {
    path: '',
    component: MessageComponent,
    canActivate: [CanActivateAuthRoute]
  }
];

export const messageRouting: ModuleWithProviders = RouterModule.forChild(routes);
