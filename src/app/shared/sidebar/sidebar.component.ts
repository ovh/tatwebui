import {Component, OnInit} from '@angular/core';
import {SidebarService} from './sidebar.service';
import {AuthentificationStore} from '../../service/auth/authentification.store';
import {SidebarTopicService} from './sidebar.topic.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {

  currentState: boolean;

  constructor(public _sidebarService: SidebarService, private _authStore: AuthentificationStore) {
    this._sidebarService.listen().subscribe(s => {
      this.currentState = s;
    });
  }

  toggleSidebar(): void {
    this._sidebarService.toggle();
  }

}
