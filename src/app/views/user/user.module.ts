import {userRouting} from './user.routing';
import {NgModule} from '@angular/core';
import {UserLoginComponent} from './login/login.component';
import {SharedModule} from '../../shared/shared.module';
import {UserSignUPComponent} from './signup/signup.component';

@NgModule({
  declarations: [
    UserLoginComponent,
    UserSignUPComponent
  ],
  imports: [
    SharedModule,
    userRouting
  ]
})
export class UserModule {
}
