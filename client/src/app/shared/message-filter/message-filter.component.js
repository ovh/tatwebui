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
    $rootScope,
    $state,
    TatEngineMessageRsc,
    TatEngineMessagesRsc,
    TatEngine,
    TatFilter,
    $localStorage,
    $location,
    Authentication,
    $http,
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

    self.suggest_labels = function (term) {
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

    self.suggest_tags = function (term) {
      if (!self.topic.tags) {
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

    self.suggest_labels_delimited = function (term) {
        return self.suggest(term, self.suggest_labels);
    };
    self.suggest_tags_delimited = function (term) {
        return self.suggest(term, self.suggest_tags);
    };

    $scope.autocomplete_options_labels = {
      suggest: self.suggest_labels_delimited
    };

    $scope.autocomplete_options_tags = {
      suggest: self.suggest_tags_delimited
    };

    self.changeLabels = function() {
      var t = [];
      for (var i = 0; i < self.selectedLabels.length; i++) {
        t.push(self.selectedLabels[i].text);
      }
      self.tmpFilter.label = t.join();
      console.log("self.tmpFilter.label:", self.tmpFilter.label);
    };

    $scope.$on('filter-changed', function(ev, filter){
      self.filter = filter;
      self.tmpFilter = filter;
    });

  },
  templateUrl: 'app/shared/message-filter/message-filter.component.html'
});
