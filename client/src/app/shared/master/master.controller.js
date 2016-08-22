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

    $scope.getBrightness = function(rgb) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgb);
      return result ?
        0.2126 * parseInt(result[1], 16) +
        0.7152 * parseInt(result[2], 16) +
        0.0722 * parseInt(result[3], 16) : 0;
    };

    $scope.urlMessage = function(message) {
      return Linker.computeURLMessage(message);
    };

    $scope.setFilterMessage = function(e, message) {
      e.preventDefault();
      TatFilter.setFilters({idMessage: message._id}).search();
    };

    $scope.isConnected = function() {
      return Authentication.isConnected();
    };

});
