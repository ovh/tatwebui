import {Component, OnInit, Input} from '@angular/core';
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
            return new Date(ts*1000);
        }
    }

}