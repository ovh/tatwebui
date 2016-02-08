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
    $state,
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
    self.topic = $stateParams.topic;
    self.view = $state.current.name;
    self.config = appConfiguration.viewconfigs[self.view];
    self.options = self.config ? self.config.filters : null;
    self.filter = TatFilter.getCurrent();
    self.tmpFilter = angular.copy(self.filter);

    self.filterSearch = function() {
      TatFilter.setFilters(self.tmpFilter).search();
    };

    $scope.$on('filter-changed', function(ev, filter){
      self.filter = filter;
      self.tmpFilter = filter;
    });

  },
  templateUrl: 'app/components/message-filter/message-filter.component.html'
});
