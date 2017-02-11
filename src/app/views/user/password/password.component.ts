import {Component} from '@angular/core';
import {User} from '../../../model/user.model';
import {UserService} from '../../../service/user/user.service';

@Component({
  selector: 'app-user-password',
  templateUrl: './password.html',
  styleUrls: ['./password.scss']
})
export class UserPasswordComponent {

  user = new User();
  showMessage = false;
  responseMessage: string;

  constructor(private _userService: UserService) {
  }

  resetPassword(): void {
    if (this.user.username && this.user.email) {
      this._userService.resetPassword(this.user, location.origin).subscribe( i => {
        this.showMessage = true;
        this.responseMessage = i.info;
      });
    }
  }
}
