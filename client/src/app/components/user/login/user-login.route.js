/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('user-login', {
    url: '/user/login',
    templateUrl: 'app/components/user/login/user-login.view.html',
    acl_bypass: true,
    translations: ['components/user']
  });
});
