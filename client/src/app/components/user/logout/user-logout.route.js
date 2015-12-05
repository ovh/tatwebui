/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('user-logout', {
    url: '/user/logout',
    templateUrl: 'app/components/user/logout/user-logout.view.html',
    acl_bypass: true,
    translations: ['components/user']
  });
});
