/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:GroupsListCtrl
 * @requires TatUi.TatEngineGroupsRsc Tat Engine Resource Messages
 * @requires TatUi.TatEngine          Tat Engine Provider
 * @description
 *
 *
 */
angular.module('TatUi')
  .controller('GroupsListCtrl', function($scope, TatEngineGroupsRsc, TatEngine) {
    'use strict';

    $scope.data = {
      filtername: "",
      adminOfOneGroup: false
    };

    /**
     * @ngdoc function
     * @name init
     * @methodOf TatUi.controller:GroupsListCtrl
     * @description  Initialize list groups page, retrieves list of groups
     */
    $scope.init = function() {
      var criteria = {
        "name": $scope.data.filtername
      };
      TatEngineGroupsRsc.list(criteria).$promise.then(function(data) {
        for (var i = 0; i < data.groups.length; i++) {
          if (data.groups[i].adminUsers) {
            $scope.data.adminOfOneGroup = true;
            break;
          }
        }
        $scope.data.groups = data.groups;
        $scope.data.count = data.count;
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    $scope.init();
  });
