/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('user-reset', {
    url: '/user/reset',
    templateUrl: 'app/components/user/reset/user-reset.view.html',
    acl_bypass: true,
    translations: ['components/user']
  });
});
