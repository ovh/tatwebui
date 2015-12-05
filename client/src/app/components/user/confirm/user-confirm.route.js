/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('user-confirm', {
    url: '/user/confirm/:username/token/:token',
    templateUrl: 'app/components/user/confirm/user-confirm.view.html',
    acl_bypass: true,
    translations: ['components/user']
  });
});
