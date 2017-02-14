import {Component, Input} from '@angular/core';
import {Topic} from '../../../model/topic.model';
import {MessageRequest, Message} from '../../../model/message.model';
import {ToastService} from '../../toast/toast.service';
import {TranslateService} from 'ng2-translate';
import {MessageSendService} from '../../../service/message/message.send.service';

@Component({
    selector: 'app-message-send',
    templateUrl: './message.send.html',
    styleUrls: ['./message.send.scss']
})
export class MessageSendComponent {

    @Input() topic: Topic;
    @Input() msgRoot: Message;

    messageText: string;

    constructor(private _msgSendSerivce: MessageSendService, private _toastService: ToastService,
        private _translate: TranslateService) { }

    sendMessage(): void {
        let request = new MessageRequest();
        request.text = this.messageText;
        if (this.msgRoot) {
            request.idReference = this.msgRoot._id;
            request.action = 'reply';
        }

        this._msgSendSerivce.sendMessage(this.topic.topic, request).subscribe(() => {
            this.messageText = '';
            this._toastService.success('', this._translate.instant('message_sent'));
        });
    }

}
