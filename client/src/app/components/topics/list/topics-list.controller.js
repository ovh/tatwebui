/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:TopicsListCtrl
 * @requires TatUi.TatEngineTopicsRsc Tat Engine Topics Resource
 * @requires TatUi.TatEngine          Tat Engine Provider
 * @description Topics List Controller
 */
angular.module('TatUi')
    .controller('TopicsListCtrl', function($scope, TatEngineTopicsRsc, TatEngine) {
    'use strict';

    $scope.data = {
      filtertopic : "",
      getForTatAdmin: false
    };

    /**
     * @ngdoc function
     * @name init
     * @methodOf TatUi.controller:TopicsListCtrl
     * @description initialize Topics List Page.
     */
    $scope.init = function() {
      var criteria = {
        "topic" : $scope.data.filtertopic,
        "getForTatAdmin": $scope.data.getForTatAdmin
      };
      TatEngineTopicsRsc.list(criteria).$promise.then(function(data){
        $scope.data.topics = data.topics;
        $scope.data.count = data.count;
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    $scope.topicsAdminMode = function(isAdminMode) {
      $scope.data.getForTatAdmin = isAdminMode;
      $scope.init();
    };

    $scope.init();
});
