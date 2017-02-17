import {Component, OnInit, NgZone} from '@angular/core';
import {TatWorker} from '../../worker/worker';
import {environment} from '../../../../environments/environment';
import {AuthentificationStore} from '../../../service/auth/authentification.store';
import {Topic, TopicListResponse} from '../../../model/topic.model';
import {TopicService} from '../../../service/topic/topic.service';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic.list.html',
  styleUrls: ['./topic.list.scss']
})
export class TopicListComponent implements OnInit {

  currentTopic: Topic;

  topicWorker: TatWorker;
  topicsPublic: Array<Topic>;
  topicsPrivate: Array<Topic>;

  // Allow angular update from work started outside angular context
  zone: NgZone;

  constructor(private _authStore: AuthentificationStore, private _topicService: TopicService) {
    this.zone = new NgZone({enableLongStackTrace: false});
    this.currentTopic = this._topicService.getTopic();
    this._topicService.listen().subscribe(t => {
      this.currentTopic = t;
    });
  }

  ngOnInit() {
    this.topicWorker = new TatWorker('assets/worker/shared/topicList.js', 'assets/worker/shared/topicList.js');
    this.topicWorker.start({user: this._authStore.getUser(), api: environment.apiURL});
    this.topicWorker.response().subscribe( msg => {
      if (msg.data && !msg.worker_id) {
        this.zone.run(() => {
          let response: TopicListResponse = JSON.parse(msg.data);
          if (response.topics && response.topics.length > 0) {
            this.topicsPrivate = new Array<Topic>();
            this.topicsPublic = new Array<Topic>();
            response.topics.forEach(t => {
              if (t.topic.indexOf('/Public') === 0) {
                this.topicsPublic.push(t);
              } else if (t.topic.indexOf('/Private') === 0) {
                this.topicsPrivate.push(t);
              }
            });
          }
        });
      }
    });
  }

  changeTopic(topic: Topic): void {
    if (!this.currentTopic || this.currentTopic._id !== topic._id) {
      this._topicService.change(topic);
    }
  }

}
