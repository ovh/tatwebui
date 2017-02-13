export class Label {
  text: string;
  color: string;
}

export class MessageListResponse {
  messages: Array<Message>;
  isTopicRw: boolean;
  isTopicAdmin: boolean;
}

export class MessageFilter {
  topic: string;
  onlyMsgRoot = true;
  lastMinUpdate: number;
  treeView = 'notree';

}

export class Message {
  _id: string;
  text: string;
  topic: string;
  inReplyOfID: string;
  inReplyOfIDRoot: string;
  nbLikes: number;
  labels: Array<Label>;
  likers: Array<string>;
  votersUP: Array<string>;
  votersDown: Array<string>;
  nbVotesUP: number;
  nbVotesDown: number;
  userMentions: Array<string>;
  urls: Array<string>;
  tags: Array<string>;
  dateCreation: number;
  dateUpdate: number;
  author: Author;
  replies: Array<Message>;
  nbReplies: number;
}

export class Author {
  username: string;
  fullname: string;
}
