import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {User} from '../../model/user.model';
import {UserService} from '../user/user.service';


@Injectable()
export class AuthentificationStore {

  // TAT Localstorage
  localStorageUserKey = 'tat-user';

  // Current connected user
  private _connectedUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  /**
   * Constructor.
   */
  constructor() {
    // Init store at startup
    const user: User = JSON.parse(localStorage.getItem(this.localStorageUserKey));
    if (user) {
      this._connectedUser.next(user);
    }
  }

  /**
   * Get Observable to be aware of connection status.
   * @returns {Observable<User>}
   */
  getUserlst(): Observable<User> {
    return new Observable<User>(fn => {
      this._connectedUser.subscribe(fn);
    });
  }

  /**
   * Get the connected User
   * @returns {User}
   */
  getUser(): User {
    return this._connectedUser.getValue();
  }

  /**
   * Check if user is connected
   * @returns {boolean}
   */
  isConnected(): boolean {
    // user is connected ?
    return this._connectedUser.getValue() != null;
  }

  /**
   * Remove user data from localstorage.
   */
  removeUser(): void {
    this._connectedUser.next(null);
    localStorage.removeItem(this.localStorageUserKey);
  }

  /**
   * Add user information in localstorage.
   * @param user User data to save in localstorage
   * @param session  Indicate if user.token is a session token or not
   */
  addUser(user: User): void {
    localStorage.setItem(this.localStorageUserKey, JSON.stringify(user));
    this._connectedUser.next(user);
  }
}
