/*global angular*/
/**
 * @ngdoc controller
 * @name TatUi.controller:UserLogoutCtrl
 * @requires TatUi.Authentication
 *
 * @description
 *
 * Manage user logout
 *
 */

angular.module('TatUi').controller('UserLogoutCtrl', function($scope, $state,
  Authentication) {
  'use strict';

  Authentication.disconnect();
  $state.go('user-login');
});
