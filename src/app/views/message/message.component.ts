
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
    templateUrl: './message.html',
    styleUrls: ['./message.scss']

})
export class MessageComponent implements OnInit, OnDestroy {

    // List of displayed messagges
    messages: Array<Message> = new Array<Message>();

    topic: Topic;

    messageSubscription: Subscription;
    messageFilter: MessageFilter = new MessageFilter();
    msgWorker: TatWorker;

    loadingMessage = false;

    zone: NgZone;

    constructor(private _authStore: AuthentificationStore, private _topicService: TopicService) {
        this.zone = new NgZone({enableLongStackTrace: false});
        this._topicService.listen().subscribe(t => {
            if (t) {
                if (!this.topic || this.topic.topic !== t.topic) {
                    this.topic = t;
                    this.loadingMessage = true;
                    if (this.msgWorker) {
                        this.msgWorker.start(this.getWorkerMsg());
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
        this.msgWorker = new TatWorker('assets/worker/web/message.js');
        this.msgWorker.start(this.getWorkerMsg());
        this.messageSubscription = this.msgWorker.response().subscribe(msg => {
            if (msg) {
                this.zone.run(() => {
                    this.messages.unshift(...(<MessageListResponse>msg).messages);
                    this.loadingMessage = false;
                });
            }
        });
    }


    getWorkerMsg(): any {
        let topic = this.topic ? this.topic.topic : '';
        return {user: this._authStore.getUser(), api: environment.apiURL, topic: topic, filter: this.messageFilter};
    }

}
