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
    self.createMessageFocus = false;

    self.suggestTags = function (term) {
      if (!self.topic.tags) {
        return [];
      }
      var q = term.toLowerCase().trim();
      var results = [];
      for (var i = 0; i < self.topic.tags.length && results.length < 10; i++) {
        var tag = self.topic.tags[i];
        if (tag.toLowerCase().indexOf(q) === 0) {
          results.push({ label: "#" + tag, value: tag });
        }
      }
      return results;
    };

    self.suggest = function (term, fnc) {
      var ix = term.lastIndexOf('#');
      if (ix == -1) {
        return [];
      }
      var lhs = term.substring(0, ix + 1),
          rhs = term.substring(ix + 1),
          suggestions = fnc(rhs);
      suggestions.forEach(function (s) {
        s.value = lhs + s.value;
      });
      return suggestions;
    };

    self.suggestTagsDelimited = function (term) {
      if (!self.topic || !self.topic.topic) {
        return;
      }
      return self.suggest(term, self.suggestTags);
    };

    self.autocompleteOptionsTags = {
      suggest: self.suggestTagsDelimited,
    };

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
