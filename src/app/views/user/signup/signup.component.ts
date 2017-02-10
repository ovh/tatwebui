import {Component} from '@angular/core';
import {AuthentificationStore} from '../../../service/auth/authentification.store';
import {User} from '../../../model/user.model';
import {UserService} from '../../../service/user/user.service';

@Component({
  selector: 'app-user-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class UserSignUPComponent {

  user = new User();
  showMessage = false;

  constructor(private _userService: UserService) {
  }

  signUP(): void {
    if (this.user.username && this.user.fullname && this.user.email) {
      this._userService.signup(this.user, location.origin).subscribe( () => {
        this.showMessage = true;
      });
    }
  }
}
