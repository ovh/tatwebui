import {Component} from '@angular/core';
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
  reponseMessage: string;

  constructor(private _userService: UserService) {
  }

  signUP(): void {
    if (this.user.username && this.user.fullname && this.user.email) {
      this._userService.signup(this.user, location.origin).subscribe( i => {
        this.showMessage = true;
        this.reponseMessage = i.info;
      });
    }
  }
}
