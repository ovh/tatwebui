/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('user-profile', {
    url: '/user/profile',
    templateUrl: 'app/components/user/profile/user-profile.view.html',
    controller: 'UserProfileCtrl',
    translations: ['components/user']
  });
});
