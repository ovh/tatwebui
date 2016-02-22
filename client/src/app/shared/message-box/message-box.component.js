/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.shared:messageBox
 * @restrict AE
 * @description
 * Create a generic message tag
 */
angular.module('TatUi').component('messageBox', {
  bindings: {
    topic: '=',
    messages: '=',
    isTopicRw: '=',
    expandReplies: '=',
    placeholder: '=',
    btnExpand: '=',
    isCompact: '=',
    tooltipBtnCompact: '='
  },
  controllerAs: 'ctrl',
  controller: function(
    $scope,
    TatEngineMessageRsc,
    TatEngine,
    TatMessage,
    $sce,
    $translate
  ) {
    'use strict';

    var self = this;
    self.filterDialog = { x: 380, y: 32, visible: false };
    self.currentMessage = '';
    self.showBox = true;
    self.createMessageFocus = false;

    if (!self.placeholder || self.placeholder === "") {
      self.placeholder = $translate.instant('shared_message_compose_placeholder');
    }

    if (self.isCompact) {
      self.showBox = false;
    }

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

    $scope.autocompleteOptionsTags = {
      suggest: self.suggestTagsDelimited,
    };

    /**
     * @ngdoc function
     * @name createMessage
     * @methodOf TatUi.shared:messageBox
     * @description Post a new message on the current topic
     * @param {string} msg Message to post
     */
    self.createMessage = function() {
      if (self.currentMessage.length > 0) {
        TatEngineMessageRsc.create({
          text: self.currentMessage,
          topic: self.topic.topic.indexOf("/") === 0 ? self.topic.topic.substr(1) : self.topic.topic
        }).$promise.then(function(data) {
          self.currentMessage = '';
          self.messages.unshift(data.message);
        }, function(err) {
          TatEngine.displayReturn(err);
        });
      }
    };

  },
  templateUrl: 'app/shared/message-box/message-box.component.html'
});
