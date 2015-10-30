/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:PresencesListCtrl
 * @requires TatUi.TatEnginePresencesRsc
 * @requires TatUi.TatEngine
 * @description List presences controller
 */
angular.module('TatUi')
    .controller('PresencesListCtrl', function($scope, $stateParams, TatEnginePresencesRsc, TatEngine) {
    'use strict';

    $scope.topic = $stateParams.topic;

    /**
     * @ngdoc function
     * @name init
     * @methodOf TatUi.controller:PresencesListCtrl
     * @description Initialize list presences page
     */
    this.init = function() {
      TatEnginePresencesRsc.list({topic:$scope.topic}).$promise.then(function(data){
          $scope.presences = data.presences;
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    this.init();
});
