/*global angular */
angular.module('TatUi')
  .controller('MasterCtrl', function MasterCtrl(
    $scope,
    Authentication,
    $cookieStore
  ) {
    'use strict';

    var self = this;

    this.data = {
      toggle: true
    };

    $scope.$on('toggle', function(ev, toggleValue) {
      self.data.toggle = toggleValue;
    });

    if (angular.isDefined($cookieStore.get('toggle'))) {
      self.data.toggle = $cookieStore.get('toggle');
    }

    $scope.isConnected = function() {
      return Authentication.isConnected();
    };

});
