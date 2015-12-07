/*global angular*/

/**
 * @ngdoc controller
 * @name TatUi.controller:UserLoginCtrl
 * @requires TatUi.Authentication
 *
 * @description
 *
 * Manage user login
 *
 */
angular.module('TatUi').controller('UserLoginCtrl', function($scope, $rootScope,
  $state, Authentication, appConfiguration) {
  'use strict';

  $scope.user = {};

  /**
   * @ngdoc function
   * @methodOf TatUi.controller:UserLoginCtrl
   * @name signup
   * @description
   *
   * Go to signup page
   */
  $scope.signup = function() {
    $state.go('user-signup');
  };

  /**
   * @ngdoc function
   * @methodOf TatUi.controller:UserLoginCtrl
   * @name resetPassword
   * @description
   *
   * Go to reset password page
   */
  $scope.resetPassword = function() {
    $state.go('user-reset');
  };

  /**
   * @ngdoc function
   * @methodOf TatUi.controller:UserLoginCtrl
   * @name connect
   * @description
   *
   * Connect the user
   */
  $scope.connect = function() {
    Authentication.connect($scope.user).then(function() {
      if ($scope.user && $scope.user.username && $scope.user.username !==
        '') {
        $rootScope.$broadcast('topic-change', {
          topic: 'Private/' + $scope.user.username
        });
      } else {
        $state.go('index');
      }
    }, function(err) {
      console.log(err);
      $state.go('index');
    });
  };

  if (appConfiguration.backend.autologin === true) {
    $scope.connect();
  }
});
