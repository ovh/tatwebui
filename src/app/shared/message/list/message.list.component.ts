import {Component, OnInit, Input} from '@angular/core';
import {Message} from '../../../model/message.model';

@Component({
    selector: 'app-message-list',
    templateUrl: './message.list.html',
    styleUrls: ['./message.list.scss']
})
export class MessageListComponent implements OnInit {

    @Input() messages: Array<Message>;

    constructor() { }

    ngOnInit() { }

}