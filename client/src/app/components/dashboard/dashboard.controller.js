/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:DashboardCtrl
 * @requires TatUi.TatEngineGroupsRsc Tat Engine Resource Messages
 * @requires TatUi.TatEngine          Tat Engine Provider
 * @description
 *
 */
angular.module('TatUi')
  .controller('DashboardCtrl', function($state, $scope, Authentication) {
    'use strict';

    $scope.init = function() {
      $state.go("standardview-list", {
        topic: 'Private/' + Authentication.getIdentity().username
      }, {
        inherit: false,
        reload: false
      });
    };
    $scope.init();
});
