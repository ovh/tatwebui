import {Label} from './message.model';
import {Hook} from './hook.model';

export class TopicListResponse {
  count: number;
  topics: Array<Topic>;
  countTopicsMsgUnread: number;
  topicsMsgUnread: Map<string, number>;
}

export class Topic {
  _id: string;
  collection: string;
  topic: string;
  description: string;
  roGroups: Array<string>;
  rwGroups: Array<string>;
  roUsers: Array<string>;
  rwUsers: Array<string>;
  adminUsers: Array<string>;
  adminGroups: Array<string>;
  history: Array<string>;
  maxlength: number;
  maxreplies: number;
  canForceDate: boolean;
  canUpdateMsg: boolean;
  canDeleteMsg: boolean;
  canUpdateAllMsg: boolean;
  canDeleteAllMsg: boolean;
  adminCanUpdateAllMsg: boolean;
  adminCanDeleteAllMsg: boolean;
  isAutoComputeTags: boolean;
  isAutoComputeLabels: boolean;
  dateModificationn: number;
  dateCreation: number;
  dateLastMessage: number;
  parameters: Array<TopicParameter>;
  tags: Array<string>;
  labels: Array<Label>;
  filters: Array<Filter>;
}

export class TopicParameter {
  key: string;
  value: string;
}

export class Filter {
  topic: string;
  _id: string;
  userID: string;
  username: string;
  title: string;
  criteria: FilterCriteria;
  hooks: Array<Hook>;
}

// FilterCriteria are used to list messages
export class FilterCriteria {
  label: string;
  notLabel: string;
  andLabel: string;
  tag: string;
  notTag: string;
  andTag: string;
  username: string;
  onlyMsgRoot: boolean;
}
