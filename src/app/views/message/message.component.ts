
import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {Subscription} from 'rxjs';
import {TatWorker} from '../../shared/worker/worker';
import {AuthentificationStore} from '../../service/auth/authentification.store';
import {environment} from '../../../environments/environment';
import {SidebarTopicService} from '../../shared/sidebar/sidebar.topic.service';
import {MessageFilter, MessageListResponse} from '../../model/message.model';

@Component({
    selector: 'app-messages',
    templateUrl: 'message.html'
})
export class MessageComponent implements OnInit, OnDestroy {

    messageSubscription: Subscription;
    messageFilter: MessageFilter = new MessageFilter();
    msgWorker: TatWorker;

    zone: NgZone;

    constructor(private _authStore: AuthentificationStore, private _sidebarTopicService: SidebarTopicService) {
        this.zone = new NgZone({enableLongStackTrace: false});
        this._sidebarTopicService.listen().subscribe(t => {
            if (this.messageFilter.topic !== t) {
                this.messageFilter.topic = t;
                if (this.msgWorker) {
                    this.msgWorker.updateWorker('subscribe', this.getWorkerMsg());
                }
            }
        });
    }

    ngOnDestroy(): void {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.msgWorker = new TatWorker('assets/worker/shared/message.js','assets/worker/web/message.js');
        this.msgWorker.start(this.getWorkerMsg());
        this.messageSubscription = this.msgWorker.response().subscribe(msg => {
            if (msg && msg.data) {
                this.zone.run(() => {
                    let msgList: MessageListResponse = JSON.parse(msg.data);
                    console.log(msgList);
                });
            }
        });
    }


    getWorkerMsg(): any {
        return {user: this._authStore.getUser(), api: environment.apiURL, filter: this.messageFilter};
    }

}
