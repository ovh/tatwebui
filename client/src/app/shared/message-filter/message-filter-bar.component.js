/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.components:messageFilterBar
 * @restrict AE
 * @description
 * Create a generic message filter bar
 */
angular.module('TatUi').component('messageFilterBar',
{
  bindings: {
    searching: '=',
    topic: '='
  },
  controllerAs: 'ctrl',
  controller: function(
    $scope,
    TatFilter
  ) {
    'use strict';

    var self = this;
    self.data = {
      search: "",
      labels: [],
      loadingAutocomplete: false,
      isEmptySearch: true
    };

    self.filter = TatFilter.getCurrent();
    self.filterAsList = {};

    self.setFilterHelpers = function() {
      TatFilter.eachFilter(function(k) {
        if (k == 'text') {
          self.filterAsList[k] = self.filter[k] ? self.filter[k]: '';
        } else {
          self.filterAsList[k] = self.filter[k] ? self.filter[k].split(','): [];
        }
      });
    };

    $scope.$on('filter-changed', function(ev, filter) {
      self.filter = filter;
      self.setFilterHelpers();
    });

    self.removeFilter = function(k, v) {
      TatFilter.removeFilter(k, v);
      self.filter = TatFilter.getCurrent();
      self.setFilterHelpers();
      TatFilter.search();
    };

    self.addPrefix = function(prefix) {
      self.data.loadingAutocomplete = true;
      self.data.search = prefix + ":";
      angular.element('#msgFilterBar').focus();
    };

    var filterKeys = {
      "tag:": "tag",
      "and-tag:": "andTag",
      "not-tag:": "notTag",
      "label:": "label",
      "and-label:": "andLabel",
      "not-label:": "notLabel",
      "text:": "text",
      "username:": "username"
    };

    self.filterSearch = function() {
      for (var k in filterKeys) {
        var idx = self.data.search.toLowerCase().indexOf(k);
        if (idx === 0) {
          var ex = self.data.search.substring(idx+k.length, self.data.search.length);
          self.filter[filterKeys[k]] = ex;
        }
      }
      TatFilter.setFilters(self.filter).search();
      self.searching = false;
      self.computeNbFilter();
    };

    self.computeNbFilter = function() {
      self.data.isEmptySearch = true;
      for(var f in self.filter) {
        if (self.filter[f] && self.filter[f] !== undefined && self.filter[f] !== null) {
          self.data.isEmptySearch = false;
          return;
        }
      }
    };

    self.computeLabelsFromTopic = function () {
      if (self.topic && self.topic.labels && self.topic.labels.length > 0) {
        for (var i = 0; i < self.topic.labels.length; i++) {
          self.data.labels.push(self.topic.labels[i].text);
        }
      }
    };

    self.suggestLabels = function (term) {
      if (self.topic && self.topic.labels &&
        (!self.data.labels || self.data.labels.length < 1 || self.data.labels.length != self.topic.labels.length)) {
        self.computeLabelsFromTopic();
      }
      var q = self.getTerm(term);
      var results = [];
      for (var i = 0; i < self.data.labels.length && results.length < 10; i++) {
        var labelText = self.data.labels[i];
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
      var q = self.getTerm(term);
      var results = [];
      for (var i = 0; i < self.topic.tags.length && results.length < 10; i++) {
        var tag = self.topic.tags[i];
        if (tag.toLowerCase().indexOf(q) === 0) {
          results.push({ label: tag, value: tag });
        }
      }
      return results;
    };

    self.getTerm = function(term) {
      var idx = term.indexOf(":");
      return term.substring(idx+1, term.length).toLowerCase().trim();
    };

    self.suggest = function (term, fnc) {
      var ix = term.lastIndexOf(',');
      if (ix < 0) {
        ix = term.lastIndexOf(':');
      }
      var lhs = term.substring(0, ix + 1),
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
    self.suggestAutocompleteSearch = function (term) {
      var ret = [];
      if (self.data.search.indexOf("tag:") >=0) {
        ret = self.suggestTagsDelimited(term);
      } else if (self.data.search.indexOf("label:") >=0) {
        ret = self.suggestLabelsDelimited(term);
      }
      self.data.loadingAutocomplete = false;
      return ret;
    };

    $scope.autocompleteSearch = {
      suggest: self.suggestAutocompleteSearch
    };

    self.setFilterHelpers();

  },
  templateUrl: 'app/shared/message-filter/message-filter-bar.component.html'
});
