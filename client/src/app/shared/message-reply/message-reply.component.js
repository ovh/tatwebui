/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.shared:messageReply
 * @restrict AE
 * @description
 * Create a generic message tag
 */
angular.module('TatUi').component('messageReply', {
  bindings: {
    message: '=',
    topic: '=',
    isReplying: '='
  },
  controllerAs: 'ctrl',
  controller: function(
    TatEngineMessageRsc,
    $translate
  ) {
    'use strict';

    var self = this;

    /**
     * @ngdoc function
     * @name replyMessage
     * @methodOf TatUi.shared:messageReply
     * @description Reply to a message
     */
    self.replyMessage = function(message) {
      self.isReplying = false;
      TatEngineMessageRsc.create({
        'topic': self.topic.topic.indexOf("/") === 0 ? self.topic.topic.substr(1) : self.topic.topic,
        'idReference': self.message._id,
        'text': self.replyText
      }).$promise.then(function(resp) {
        self.replyText = "";
        if (!self.message.replies) {
          self.message.replies = [];
        }
        self.message.replies.unshift(resp.message);
      }, function(resp) {
        self.isReplying = true;
        TatEngine.displayReturn(resp);
      });
    };

  },
  templateUrl: 'app/shared/message-reply/message-reply.component.html'
});
