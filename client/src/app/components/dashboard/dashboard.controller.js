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
  .controller('DashboardCtrl', function($rootScope, $scope, Authentication) {
    'use strict';

    $scope.init = function() {
      $rootScope.$broadcast('topic-change', {
        topic: 'Private/' + Authentication.getIdentity().username
      });
    };

    $scope.init();
});
