import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/Rx';

@Injectable()
export class SidebarService {

  private _sidebarStatus: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() {
  }

  listen(): Observable<boolean> {
    return new Observable<boolean>(fn => this._sidebarStatus.subscribe(fn));
  }

  open(): void {
    this._sidebarStatus.next(true);
  }

  close(): void {
    this._sidebarStatus.next(false);
  }

  toggle(): void {
    let currentStatus = this._sidebarStatus.getValue();
    this._sidebarStatus.next(!currentStatus);
  }

  state(): boolean {
    return this._sidebarStatus.getValue();
  }

}
