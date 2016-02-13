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
    issurewithnofilter: '=',
    isnofilter: '=',
    topic: '='
  },
  controllerAs: 'MessageFilterBar',
  controller: function(
    $scope,
    $rootScope,
    TatEngineMessageRsc,
    TatEngineMessagesRsc,
    TatEngine,
    TatFilter,
    $stateParams,
    $localStorage,
    $location,
    Authentication,
    $http,
    appConfiguration
  ) {
    'use strict';

    var self = this;

    //console.log("messageFilterBar> topic:", this.topic);
    //self.topic = $stateParams.topic;
    self.filter = TatFilter.getCurrent();
    self.filterAsList = {};

    self.setFilterHelpers = function() {
      TatFilter.eachFilter(function(k){
        if (k == 'text') {
          self.filterAsList[k] = self.filter[k] ? self.filter[k]: '';
        }
        else {
          self.filterAsList[k] = self.filter[k] ? self.filter[k].split(','): [];
        }
      });
    };

    $scope.$on('filter-changed', function(ev, filter){
      self.filter = filter;
      self.setFilterHelpers();
    });

    self.removeFilter = function(k, v) {
      TatFilter.removeFilter(k, v);
      self.filter = TatFilter.getCurrent();
      self.setFilterHelpers();
      TatFilter.search();
    };

    self.setFilterHelpers();

  },
  templateUrl: 'app/components/message-filter/message-filter-bar.component.html'
});
