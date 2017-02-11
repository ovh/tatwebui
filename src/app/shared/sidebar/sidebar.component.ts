import {Component, OnInit, OnDestroy} from '@angular/core';
import {SidebarService} from './sidebar.service';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {

  constructor(private _sidebarService: SidebarService) {

  }

  toggleSidebar(): void {
    this._sidebarService.toggle();
  }

}
