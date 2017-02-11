import {Component, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {SidebarService} from './shared/sidebar/sidebar.service';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  statusSubscription: Subscription;
  openedSidebar = true; // true = open

  constructor(private translate: TranslateService, private _sidebarService: SidebarService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit(): void {
    if (!this.statusSubscription) {
      this.statusSubscription = this._sidebarService.listen().subscribe( s => {
        this.openedSidebar = s;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }


}
