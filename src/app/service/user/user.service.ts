import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {User, SignUpRequest} from '../../model/user.model';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UserService {

  constructor(private _http: Http) {
  }

  /**
   * Call API to create a user
   * @param user User to create
   * @param href callback url
   * @returns {Observable<User>}
   */
  signup(user: User, href: string): Observable<boolean> {
    let request = new SignUpRequest();
    request.username = user.username;
    request.fullname = user.fullname;
    request.email = user.email;
    request.callback = href + '/user/verify/%s/%s';
    return this._http.post('/user', request).map( () => {
      return true;
    });
  }

  /**
   * LogIN
   * @param user User credential
   * @returns {Observable<User>}
   */
  login(user: User): Observable<User> {
    return this._http.post('', user).map( u => u.json());
  }

}
