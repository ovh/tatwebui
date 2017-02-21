import {Component, OnInit, Input, OnDestroy, NgZone} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {Message, MessageFilter, MessageListResponse} from '../../../model/message.model';
import {Topic} from '../../../model/topic.model';
import {TatWorker} from '../../worker/worker';
import {AuthentificationStore} from '../../../service/auth/authentification.store';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-message-list',
    templateUrl: './message.list.html',
    styleUrls: ['./message.list.scss']
})
export class MessageListComponent implements OnInit, OnDestroy {

    @Input() topic: Topic;
    @Input() messages: Array<Message>;
    @Input() canHaveReplies = true;

    selectedMessage: Message;
    replies: Array<Message> = new Array<Message>();

    // Worker for replies
    repliesWorker: TatWorker;
    repliesSubscription: Subscription;

    zone: NgZone;

    constructor(private _authStore: AuthentificationStore) {
        this.zone = new NgZone({enableLongStackTrace: false});
    }

    ngOnInit() { }

    ngOnDestroy() {
        if (this.repliesSubscription) {
            this.repliesSubscription.unsubscribe();
        }
        if (this.repliesWorker) {
            this.repliesWorker.webWorker.terminate();
        }
    }

    select(m: Message): void {
        this.selectedMessage = m;
        if (this.repliesSubscription) {
            this.repliesWorker.webWorker.terminate();
            this.repliesSubscription.unsubscribe();
        }
        this.repliesWorker = new TatWorker('assets/worker/web/message.js');
        let msgFilter = new MessageFilter();
        msgFilter.inReplyOfIDRoot = this.selectedMessage._id;
        msgFilter.onlyMsgRoot = false;
        this.repliesWorker.start({user: this._authStore.getUser(), api: environment.apiURL, topic: this.topic.topic, filter: msgFilter});
        this.repliesSubscription = this.repliesWorker.response().subscribe(msg => {
            if (msg) {
                this.zone.run(() => {
                    this.replies.unshift(...(<MessageListResponse>msg).messages);
                });
            }
        });
    }

    unselect(): void {
        delete this.selectedMessage;
    }
}
