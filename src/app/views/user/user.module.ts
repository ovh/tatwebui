import {userRouting} from './user.routing';
import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    userRouting
  ]
})
export class UserModule {
}
