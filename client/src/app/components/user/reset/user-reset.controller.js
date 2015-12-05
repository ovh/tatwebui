/*global angular*/
angular.module('TatUi').controller('UserResetCtrl', function($scope,
  Authentication, $state, TatEngine) {
  'use strict';

  $scope.user = {};

  $scope.resetPassword = function() {
    Authentication.reset($scope.user.username, $scope.user.email).then(
      function(data) {
        $state.go('user-signup-done');
      },
      function(err) {
        $scope.user = {};
        TatEngine.displayReturn(err);
      });
  };

});
