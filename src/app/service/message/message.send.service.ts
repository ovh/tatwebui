import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {MessageRequest} from '../../model/message.model';

@Injectable()
export class MessageSendService {

    constructor(private _http: Http) { }

    sendMessage(topic: string, msg: MessageRequest): Observable<any> {
        return this._http.post('/message' + topic, msg);
    }

}
