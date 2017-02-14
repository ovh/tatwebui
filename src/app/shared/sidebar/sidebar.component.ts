import {Component} from '@angular/core';
import {SidebarService} from '../../service/sidebar/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {

  currentState: boolean;

  constructor(public _sidebarService: SidebarService) {
    this._sidebarService.listen().subscribe(s => {
      this.currentState = s;
    });
  }

  toggleSidebar(): void {
    this._sidebarService.toggle();
  }

}
