
import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {TatWorker} from '../../shared/worker/worker';
import {AuthentificationStore} from '../../service/auth/authentification.store';
import {environment} from '../../../environments/environment';
import {MessageFilter, MessageListResponse, Message} from '../../model/message.model';
import {Topic} from '../../model/topic.model';
import {TopicService} from '../../service/topic/topic.service';

@Component({
    selector: 'app-messages',
    templateUrl: 'message.html'
})
export class MessageComponent implements OnInit, OnDestroy {

    // List of displayed messagges
    messages: Array<Message>;

    topic: Topic;

    messageSubscription: Subscription;
    messageFilter: MessageFilter = new MessageFilter();
    msgWorker: TatWorker;

    zone: NgZone;

    constructor(private _authStore: AuthentificationStore, private _topicService: TopicService) {
        this.zone = new NgZone({enableLongStackTrace: false});
        this._topicService.listen().subscribe(t => {
            if (t) {
                this.topic = t;
                if (this.messageFilter.topic !== t.topic) {
                    this.messageFilter.topic = t.topic;
                    if (this.msgWorker) {
                        this.msgWorker.updateWorker('subscribe', this.getWorkerMsg());
                    }
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
        this.msgWorker = new TatWorker('assets/worker/shared/message.js', 'assets/worker/web/message.js');
        this.msgWorker.start(this.getWorkerMsg());
        this.messageSubscription = this.msgWorker.response().subscribe(msg => {
            if (msg && msg.data) {
                this.zone.run(() => {
                    let msgList: MessageListResponse = JSON.parse(msg.data);
                    this.messages = msgList.messages;
                });
            }
        });
    }


    getWorkerMsg(): any {
        return {user: this._authStore.getUser(), api: environment.apiURL, filter: this.messageFilter};
    }

}
