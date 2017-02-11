import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AuthentificationStore} from '../../../service/auth/authentification.store';
import {User} from '../../../model/user.model';

@Component({
    selector: 'app-user-verify',
    templateUrl: './verify.html',
    styleUrls: ['./verify.scss']
})
export class UserVerifyComponent implements OnInit {
  userVerified = {};
  showErrorMessage = false;

  constructor(private _userService: UserService, private _router: Router,
              private _activatedRoute: ActivatedRoute, private _authStore: AuthentificationStore) {
  }

  ngOnInit(): void {
    let params: Params = this._activatedRoute.snapshot.params;
    if (params['username'] && params['token']) {
      this._userService.verify(params['username'], params['token']).subscribe( v => {
        this.userVerified['username'] = v.username;
        this.userVerified['password'] = v.password;
      }, (error) => {
        this.showErrorMessage = true;
      });
    }
  }

  signIn() {
    let user = new User();
    user.username = this.userVerified['username'];
    user.password = this.userVerified['password'];
    this._authStore.addUser(user);
    this._router.navigate(['home']);
  }

}
