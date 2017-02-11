import {userRouting} from './user.routing';
import {NgModule} from '@angular/core';
import {UserLoginComponent} from './login/login.component';
import {SharedModule} from '../../shared/shared.module';
import {UserSignUPComponent} from './signup/signup.component';
import {UserPasswordComponent} from './password/password.component';
import {UserVerifyComponent} from './verify/verify.component';

@NgModule({
  declarations: [
    UserLoginComponent,
    UserPasswordComponent,
    UserSignUPComponent,
    UserVerifyComponent,
  ],
  imports: [
    SharedModule,
    userRouting
  ]
})
export class UserModule {
}
