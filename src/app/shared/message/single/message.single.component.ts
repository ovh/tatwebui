import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Message} from '../../../model/message.model';

@Component({
    selector: 'app-message-single',
    templateUrl: './message.single.html',
    styleUrls: ['./message.single.scss']
})
export class MessageSingleComponent implements OnInit {

    @Input() message: Message;

    constructor() { }

    ngOnInit() { }

    getDateUpdate(): Date {
        if (this.message) {
            let ts = Math.floor(this.message.dateUpdate);
            return new Date(ts * 1000);
        }
    }

    transform(value: string): string {
        return this.replaceHashtag(value);
    }

    replaceHashtag(value: string): string {
        let hashTagIndex = value.indexOf(' #') ;
        if (hashTagIndex === -1) {
            return value;
        }
        hashTagIndex++;
        let spaceIndex = value.indexOf(' ', hashTagIndex);

        if (spaceIndex !== -1) {
            // Replace space
            let valueBegin = value.substr(0, spaceIndex);
            let valueEnd = value.substr(spaceIndex, value.length - 1);
            value = valueBegin + '</span>' + valueEnd;
        }

        // Replace #
        let valueBegin = value.substr(0, hashTagIndex);
        let valueEnd = value.substr(hashTagIndex, value.length - 1);
        value = valueBegin + '<span class="messageTag">' + valueEnd;

        return this.replaceHashtag(value);
    }

}
