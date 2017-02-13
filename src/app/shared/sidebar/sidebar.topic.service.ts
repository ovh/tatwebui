import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/Rx';

@Injectable()
export class SidebarTopicService {

    private _sidebarTopic: BehaviorSubject<string> = new BehaviorSubject('');

    constructor() {
    }

    listen(): Observable<string> {
        return new Observable<string>(fn => this._sidebarTopic.subscribe(fn));
    }

    change(topic: string): void {
        this._sidebarTopic.next(topic);
    }

    getTopic(): string {
        return this._sidebarTopic.getValue();
    }
}
