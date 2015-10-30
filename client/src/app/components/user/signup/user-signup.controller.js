/*global angular*/

/**
 * @ngdoc controller
 * @name TatUi.controller:UserSignupCtrl
 * @required Authentication
 * @required TatEngine
 * @description User Signup Controller
 */
angular.module('TatUi').controller('UserSignupCtrl', function ($scope, $state, appConfiguration, Authentication, TatEngine, TatEngineSystemRsc) {
    'use strict';

    $scope.user = {};

    this.init = function() {
      TatEngineSystemRsc.capabilities().$promise.then(function(data) {
        if (data.username_from_email === true) {
          $scope.displayUsername = false;
        } else {
          $scope.displayUsername = true;
        }
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    $scope.helpSignup = [];
    if (appConfiguration.help && appConfiguration.help.signup) {
      $scope.helpSignup = appConfiguration.help.signup;
    }

    $scope.signup = function() {
        Authentication.signup($scope.user.username, $scope.user.fullname, $scope.user.email).then(
            function(data) {
            $state.go('user-signup-done');
        }, function(err) {
            $scope.user = {};
            TatEngine.displayReturn(err);
        });
    };

    this.init();
});
