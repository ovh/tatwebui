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
    issurewithnofilter: '=',
    isnofilter: '='
  },
  controllerAs: 'MessageFilter',
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

    self.filter = TatFilter.getCurrent();
    self.tmpFilter = self.filter;
    self.topic = $stateParams.topic;

    self.filterSearch = function() {
      self.filter = self.tmpFilter;
      TatFilter.setFilters(self.filter).search();
    };

    $scope.$on('filter-changed', function(ev, filter){
      self.filter = filter;
    });

  },
  templateUrl: 'app/components/message-filter/message-filter.component.html'
});
