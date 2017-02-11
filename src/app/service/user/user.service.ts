import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {User, SignUpRequest, InfoResponse, ResetPasswordRequest, VerifyResponse} from '../../model/user.model';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UserService {

  constructor(private _http: Http) {
  }

  /**
   * Call API to create a user
   * @param user User to create
   * @param href callback url
   * @returns {Observable<InfoResponse>}
   */
  signup(user: User, href: string): Observable<InfoResponse> {
    let request = new SignUpRequest();
    request.username = user.username;
    request.fullname = user.fullname;
    request.email = user.email;
    request.callback = this.getCallbackURL(href);
    return this._http.post('/user', request).map(i => i.json());
  }

  /**
   * LogIN
   * @param user User credential
   * @returns {Observable<User>}
   */
  login(user: User): Observable<User> {
    return this._http.post('', user).map(u => u.json());
  }

  /**
   * Reset user password
   * @param user User
   * @param origin Callback url
   * @returns {Observable<R>}
   */
  resetPassword(user: User, origin: string): Observable<InfoResponse> {
    let request = new ResetPasswordRequest();
    request.username = user.username;
    request.email = user.email;
    request.callback = this.getCallbackURL(origin);
    return this._http.post('/user/reset', request).map(i => i.json());
  }

  getCallbackURL(origin: string): string {
    return origin + '/user/verify/:username/:token';
  }

  /**
   * Verify user token
   * @param username Username
   * @param token token
   * @returns {Observable<VerifyResponse>}
   */
  verify(username: string, token: string): Observable<VerifyResponse> {
    let options: RequestOptions = new RequestOptions();
    options.withCredentials = false;
    return this._http.get('/user/verify/' + username + '/' + token, options).map(v => v.json());
  }
}
