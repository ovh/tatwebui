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

  TatEngineUsersRsc.list({
    username: Identity.getIdentity().username,
    withGroups: true
  }).$promise.then(function(data) {
    if (data.count == 1) {
      $scope.user = data.users[0];
    }
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
