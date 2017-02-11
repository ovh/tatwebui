import {Component} from '@angular/core';
import {User} from '../../../model/user.model';
import {AuthentificationStore} from '../../../service/auth/authentification.store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class UserLoginComponent {

  user = new User();

  constructor(private _authStore: AuthentificationStore, private _router: Router) {
  }

  logIN(): void {
      if (this.user.username && this.user.password) {
        this._authStore.addUser(this.user);
        this._router.navigate(['home']);
      }
  }

}
