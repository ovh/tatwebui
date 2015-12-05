/*global angular*/

/**
 * @ngdoc controller
 * @name TatUi.controller:UserConfirmCtrl
 * @requires TatUi.Authentication
 * @requires TatUi.Identity
 * @requires TatUi.TatEngine
 *
 * @description
 *
 * Manage user confirmation with link provided in the confirmation email
 *
 */
angular.module('TatUi').controller('UserConfirmCtrl', function($scope,
  $stateParams, Authentication, $state, Identity, TatEngine) {
  'use strict';

  $scope.username = $stateParams.username;
  $scope.token = $stateParams.token;

  /**
   * @ngdoc function
   * @name back
   * @methodOf TatUi.controller:UserConfirmCtrl
   * @description
   *
   * redirect to login page
   */
  $scope.back = function() {
    $state.go('user-login');
  };

  this.verify = function() {
    var id = Identity.getIdentity();
    if ((id) && (id.username === $scope.username)) {
      $scope.password = id.password;
      return;
    }
    Authentication.verify($scope.username, $scope.token).then(
      function(data) {
        $scope.password = data.password;
      },
      function(err) {
        $scope.err = {
          error: err
        };
        TatEngine.displayReturn(err);
      });
  };

  this.verify();

});
