import {Component, OnInit, NgZone} from '@angular/core';
import {TatWorker} from '../../worker/worker';
import {environment} from '../../../../environments/environment';
import {AuthentificationStore} from '../../../service/auth/authentification.store';
import {Topic, TopicListResponse} from '../../../model/topic.model';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic.list.html',
  styleUrls: ['./topic.list.scss']
})
export class TopicListComponent implements OnInit {

  topicWorker: TatWorker;
  topics: Array<Topic>;

  // Allow angular update from work started outside angular context
  zone: NgZone;

  constructor(private _authStore: AuthentificationStore) {
    this.zone = new NgZone({enableLongStackTrace: false});
  }

  ngOnInit() {
    this.topicWorker = new TatWorker('assets/worker/shared/topicList.js', 'assets/worker/shared/topicList.js');
    this.topicWorker.start({user: this._authStore.getUser(), api: environment.apiURL});
    this.topicWorker.response().subscribe( msg => {
      if (msg.data && !msg.worker_id) {
        this.zone.run(() => {
          let response: TopicListResponse = JSON.parse(msg.data);
          this.topics = response.topics;
        });
      }
    });
  }

}
