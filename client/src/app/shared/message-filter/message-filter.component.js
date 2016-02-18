/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.components:messageFilter
 * @restrict AE
 * @description
 * Create a generic message filter
 */
angular.module('TatUi').component('messageFilter',
{
  bindings: {
    topic: '='
  },
  controllerAs: 'MessageFilter',
  controller: function(
    $scope,
    $state,
    TatEngine,
    TatFilter,
    appConfiguration
  ) {
    'use strict';

    var self = this;
    //self.topic = $stateParams.topic;
    self.view = $state.current.name;
    self.config = appConfiguration.viewconfigs[self.view];
    self.options = self.config ? self.config.filters : null;
    self.filter = TatFilter.getCurrent();
    self.tmpFilter = angular.copy(self.filter);
    self.labels = [];

    self.filterSearch = function() {
      TatFilter.setFilters(self.tmpFilter).search();
    };

    self.computeLabelsFromTopic = function () {
      if (self.topic && self.topic.labels && self.topic.labels.length > 0) {
        for (var i = 0; i < this.topic.labels.length; i++) {
          self.labels.push(this.topic.labels[i].text);
        }
      }
    };

    self.suggestLabels = function (term) {
      if (self.topic && self.topic.labels &&
        (!self.labels || self.labels.length < 1 || self.labels.length != self.topic.labels.length)) {
        self.computeLabelsFromTopic();
      }
      var q = term.toLowerCase().trim();
      var results = [];
      for (var i = 0; i < self.labels.length && results.length < 10; i++) {
        var labelText = self.labels[i];
        if (labelText.toLowerCase().indexOf(q) === 0) {
          results.push({ label: labelText, value: labelText });
        }
      }
      return results;
    };

    self.suggestTags = function (term) {
      if (!self.topic || !self.topic.tags) {
        return [];
      }
      var q = term.toLowerCase().trim();
      var results = [];
      for (var i = 0; i < self.topic.tags.length && results.length < 10; i++) {
        var tag = self.topic.tags[i];
        if (tag.toLowerCase().indexOf(q) === 0) {
          results.push({ label: tag, value: tag });
        }
      }
      return results;
    };

    self.suggest = function (term, fnc) {
      var ix = term.lastIndexOf(','),
          lhs = term.substring(0, ix + 1),
          rhs = term.substring(ix + 1),
          suggestions = fnc(rhs);
      suggestions.forEach(function (s) {
        s.value = lhs + s.value;
      });
      return suggestions;
    };

    self.suggestLabelsDelimited = function (term) {
        return self.suggest(term, self.suggestLabels);
    };
    self.suggestTagsDelimited = function (term) {
        return self.suggest(term, self.suggestTags);
    };

    $scope.autocompleteOptionsLabels = {
      suggest: self.suggestLabelsDelimited
    };

    $scope.autocompleteOptionsTags = {
      suggest: self.suggestTagsDelimited
    };

    self.changeLabels = function() {
      var t = [];
      for (var i = 0; i < self.selectedLabels.length; i++) {
        t.push(self.selectedLabels[i].text);
      }
      self.tmpFilter.label = t.join();
    };

    $scope.$on('filter-changed', function(ev, filter){
      self.filter = filter;
      self.tmpFilter = filter;
    });

  },
  templateUrl: 'app/shared/message-filter/message-filter.component.html'
});
