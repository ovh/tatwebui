import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {Topic} from '../../model/topic.model';

@Injectable()
export class TopicService {

    private _currentTopic: BehaviorSubject<Topic> = new BehaviorSubject(null);

    constructor() {
    }

    listen(): Observable<Topic> {
        return new Observable<Topic>(fn => this._currentTopic.subscribe(fn));
    }

    change(topic: Topic): void {
        this._currentTopic.next(topic);
    }

    getTopic(): Topic {
        return this._currentTopic.getValue();
    }
}
