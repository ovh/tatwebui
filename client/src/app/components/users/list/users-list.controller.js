/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:UsersListCtrl
 * @requires TatUi.TatEngineUsersRsc
 * @requires TatUi.TatEngine         Tat Engine Provider
 * @description Users List Controller
 */
angular.module('TatUi')
  .controller('UsersListCtrl', function($scope, TatEngineUsersRsc, TatEngine) {
    'use strict';

    $scope.data = {
      filterusername: "",
      filterList: ""
    };

    /**
     * @ngdoc function
     * @name init
     * @methodOf TatUi.controller:UsersListCtrl
     * @description Initialize User List page
     */
    $scope.init = function() {
      var criteria = {
        "username": $scope.data.filterusername
      };
      TatEngineUsersRsc.list(criteria).$promise.then(function(data) {
        $scope.data.users = data.users;
        $scope.data.count = data.count;
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    $scope.init();
  });
