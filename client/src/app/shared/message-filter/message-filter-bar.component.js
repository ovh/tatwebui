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
    disabledDetails: '=',
    searching: '=',
    topic: '='
  },
  controllerAs: 'ctrl',
  controller: function(
    $scope,
    TatEngine,
    TatEngineTopicRsc,
    TatFilter
  ) {
    'use strict';

    var self = this;
    self.data = {
      title: "",
      saving: false,
      typeHooks: ["tathook-webhook", "tathook-xmpp-out"],
      search: "",
      currentHelp: "",
      labels: [],
      loadingAutocomplete: false,
      isEmptySearch: true,
      searchingDate: false,
      dateOptions: {
        startingDay: 1,
        showWeeks: true,
        maxDate: new Date(2040, 5, 22),
        minDate: new Date(2015, 11, 22)
      }
    };

    self.filter = TatFilter.getCurrent();
    self.filterAsList = {};

    self.setFilterHelpers = function() {
      TatFilter.eachFilter(function(k) {
        if (k === 'text' || k.indexOf("date") === 0) {
          self.filterAsList[k] = self.filter[k] ? self.filter[k]: '';
        } else {
          self.filterAsList[k] = self.filter[k] ? self.filter[k].split(','): [];
        }
      });
      self.computeNbFilter();
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

    // prefix = dateCreation or dateUpdate
    self.dateSearchForm = function(prefix) {
      self.data.searchingDate = true;
      self.data.prefix = prefix;
      self.data.search = "";
      self.data.currentHelp = "shared_filter_help_" + prefix;
    };

    self.addPrefix = function(prefix) {
      self.data.prefix = prefix;
      self.data.search = "";
      self.data.currentHelp = "shared_filter_help_" + prefix;
      angular.element('#msgFilterBar').focus();
      self.data.searchingDate = false;
    };

    self.filterSearch = function(addOnly) {
      if (self.data.prefix === "dateCreation") {
        self.filter.dateMinCreation = moment(self.data.dateMinSearch).unix();
        self.filter.dateMaxCreation = moment(self.data.dateMaxSearch).unix();
      } else if (self.data.prefix === "dateUpdate") {
        self.filter.dateMinUpdate = moment(self.data.dateMinSearch).unix();
        self.filter.dateMaxUpdate = moment(self.data.dateMaxSearch).unix();
      } else {
        self.filter[self.data.prefix] = self.data.search;
      }

      TatFilter.setFilters(self.filter).search();
      if (addOnly !== true) {
        self.searching = false;
        self.data.searchingDate = false;
      }
      self.data.prefix = "";
      self.computeNbFilter();
      self.data.search = "";
    };

    self.filterSaveCurrent = function() {
      TatEngineTopicRsc.addFilter({
        topic: self.topic.topic,
        title: self.data.title,
      	criteria: {
          label: self.filter.label,
          notLabel: self.filter.notLabel,
          andLabel: self.filter.andLabel,
          tag: self.filter.tag,
          notTag: self.filter.notTag,
          andTag: self.filter.andTag,
          username: self.filter.username,
          onlyMsgRoot: self.filter.onlyMsgRoot ? "true" : "false"
        }
      }).$promise.then(function(data) {
        self.data.saving = false;
        self.refreshTopic();
        TatEngine.displayReturn(data);
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    self.filterUpdate = function(f) {
      if (f.criteria.onlyMsgRoot) {
        f.criteria.onlyMsgRoot = "true";
      } else {
        f.criteria.onlyMsgRoot = "false";
      }
      TatEngineTopicRsc.updateFilter({
        _id: f._id,
        topic: self.topic.topic,
        title: self.data.title,
      	criteria: f.criteria,
      	hooks: f.hooks
      }).$promise.then(function(data) {
        self.refreshTopic();
        TatEngine.displayReturn(data);
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    self.filterDelete = function(f) {
      TatEngineTopicRsc.removeFilter({
        _id: f._id,
        topic: self.topic.topic
      }).$promise.then(function(data) {
        self.refreshTopic();
        TatEngine.displayReturn(data);
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    self.addHook = function(f) {
      if (!f.hooks) {
        f.hooks = [];
      }
      f.hooks.push({
        _id: new Date(),
        type: "tathook-xmpp-out",
        destination: "youconf@conference.jabber.domain.net",
        enabled: false
      });
    };

    self.refreshTopic = function() {
      TatEngineTopicRsc.oneTopic({
        action: self.topic.topic.substring(1)
      }).$promise.then(function(data) {
        self.topic = data.topic;
        self.data.topic = data.topic;
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    self.applyFilter = function(f) {
      TatFilter.setFilters(f.criteria).search();
      self.searching = false;
      self.data.prefix = "";
      self.computeNbFilter();
      self.data.search = "";
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
      var q = term.toLowerCase().trim();
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
      var ix = term.lastIndexOf(',');
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
      self.data.loadingAutocomplete = true;
      var ret = [];
      if (self.data.prefix.toLowerCase().indexOf("tag") >=0) {
        ret = self.suggestTagsDelimited(term);
      } else if (self.data.prefix.toLowerCase().indexOf("label") >=0) {
        ret = self.suggestLabelsDelimited(term);
      } else {
        self.data.currentHelp = "";
      }
      self.data.loadingAutocomplete = false;
      return ret;
    };

    $scope.autocompleteSearch = {
      suggest: self.suggestAutocompleteSearch
    };

    self.viewFilterDate = function(prefix) { // prefix = dateCreation or dateUpdate
      self.searching = true;
      self.data.searchingDate = true;
      self.data.prefix = prefix;
    };

    self.viewFilter = function(prefix) { // prefix = "tag", etc...
      if (self.disabledDetails === true) {
        return;
      }
      self.data.currentHelp = "shared_filter_help_" + prefix;
      if (prefix.indexOf("date") === 0) { // dateCreation, dateCreation, dateUpdate, dateUpdate
        self.searching = true;
        self.data.searchingDate = true;
        self.data.prefix = prefix;
        self.data.search = "";

        if (prefix === "dateCreation") {
          if (self.filter.dateMinCreation) {
            self.data.dateMinSearch = moment.unix(self.filter.dateMinCreation).toDate();
          }
          if (self.filter.dateMaxCreation) {
            self.data.dateMaxSearch = moment.unix(self.filter.dateMaxCreation).toDate();
          }
        } else if (prefix === "dateUpdate") {
          if (self.filter.dateMinUpdate) {
            self.data.dateMinSearch = moment.unix(self.filter.dateMinUpdate).toDate();
          }
          if (self.filter.dateMaxUpdate) {
            self.data.dateMaxSearch = moment.unix(self.filter.dateMaxUpdate).toDate();
          }
        }
      } else if (self.filter[prefix]) {
        self.searching = true;
        self.data.searchingDate = false;
        self.data.prefix = prefix;
        self.data.search = self.filter[prefix];
      }
    };

    self.setFilterHelpers();

  },
  templateUrl: 'app/shared/message-filter/message-filter-bar.component.html'
});
