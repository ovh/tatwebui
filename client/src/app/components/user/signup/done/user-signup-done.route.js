/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('user-signup-done', {
    url: '/user/signup/done',
    templateUrl: 'app/components/user/signup/done/user-signup-done.view.html',
    acl_bypass: true,
    translations: ['components/user']
  });
});
