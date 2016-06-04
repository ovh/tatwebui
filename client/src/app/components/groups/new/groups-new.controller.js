/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:GroupsNewCtrl
 * @requires TatUi.TatEngineGroupRsc Tat Engine Resource Group
 * @requires TatUi.TatEngine         Tat Engine Provider
 * @description Controller of create a group
 *
 */
angular.module('TatUi')
  .controller('GroupsNewCtrl', function($scope, $stateParams, $state,
    TatEngineGroupRsc, TatEngine) {
    'use strict';

    $scope.group = {
      'name': '',
      'description': ''
    };

    /**
     * @ngdoc function
     * @name createGroup
     * @methodOf TatUi.controller:GroupsNewCtrl
     * @description Create group with name and description. Calling Tat Engine Resource Group
     */
    $scope.createGroup = function() {
      TatEngineGroupRsc.create({
        'name': $scope.group.name,
        'description': $scope.group.description
      }).$promise.then(function(data) {
        $state.go('groups-edit', {
          groupName: data.name
        });
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

  });
