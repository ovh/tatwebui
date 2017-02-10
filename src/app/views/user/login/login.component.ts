import {Component} from '@angular/core';
import {User} from '../../../model/user.model';
import {AuthentificationStore} from '../../../service/auth/authentification.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class UserLoginComponent {

  user = new User();

  constructor(_authStore: AuthentificationStore) {
  }

  logIN(): void {
      if (this.user.username && this.user.password) {

      }
  }

}
