/*global angular*/
angular.module('TatUi').controller('UserProfileCtrl', function(
  $scope,
  $state,
  Authentication,
  AuthenticationRsc,
  Identity,
  TatEngine,
  TatEngineUsersRsc
  ) {
  'use strict';

  AuthenticationRsc.getInfo({}).$promise.then(function(data) {
    $scope.user = data.user;
  }, function(err) {
    TatEngine.displayReturn(err);
  });

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
