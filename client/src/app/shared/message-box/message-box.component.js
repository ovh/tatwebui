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
    placeholder: '@',
    btnExpand: '=',
    isCompact: '=',
    tooltipBtnCompact: '=',
    defaultLabels: '='
  },
  controllerAs: 'ctrl',
  controller: function(
    $scope,
    TatEngineMessageRsc,
    TatEngine,
    TatMessage,
    TatFilter,
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
      var lhs = term.substring(0, ix + 1), rhs = term.substring(ix + 1), suggestions = fnc(rhs);
      suggestions.forEach(function (s) {
        s.value = lhs + s.value;
      });
      return suggestions;
    };

    self.getBrightness = function(rgb) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgb);
      return result ?
        0.2126 * parseInt(result[1], 16) +
        0.7152 * parseInt(result[2], 16) +
        0.0722 * parseInt(result[3], 16) : 0;
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
     * @name removeLabel
     * @methodOf TatUi.shared:messageBox
     * @description Removes a default label
     * @param {string} label label to remove
     */
    self.removeLabel = function(labelText) {
      _.remove(self.defaultLabels, function(n) {
        return n.text === labelText;
      });
    };

    self.applyFilter = function(f) {
      TatFilter.setFilters(f.criteria).search();
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

        var objMsg = {
          text: self.currentMessage,
          topic: self.topic.topic.indexOf("/") === 0 ? self.topic.topic.substr(1) : self.topic.topic
        };

        if (self.defaultLabels && self.defaultLabels instanceof Array) {
          objMsg.labels = self.defaultLabels;
        }

        TatEngineMessageRsc.create(objMsg).$promise.then(function(data) {
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
