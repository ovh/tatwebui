/*global angular */
angular.module('TatUi')
  .controller('MasterCtrl', function MasterCtrl(
    $scope,
    $cookieStore,
    $state,
    Authentication,
    Linker,
    TatFilter
  ) {
    'use strict';

    var self = this;

    this.data = {
      showSidebar: true
    };

    $scope.$on('showSidebar', function(ev, showSidebar) {
      self.data.showSidebar = showSidebar;
    });

    if (angular.isDefined($cookieStore.get('showSidebar'))) {
      self.data.showSidebar = $cookieStore.get('showSidebar');
    }

    $scope.isAdmin = function() {
      if (Authentication.isConnected()) {
        return Authentication.getIdentity().isAdmin;
      }
      return false;
    };

    $scope.urlMessage = function(message) {
      return Linker.computeURLMessage($state, message);
    };

    $scope.setFilterMessage = function(e, message) {
      e.preventDefault();
      TatFilter.setFilters({idMessage: message._id}).search();
    };

    $scope.isConnected = function() {
      return Authentication.isConnected();
    };

});
