/*global angular*/
angular.module('TatUi').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('user-signup', {
        url: '/user/signup',
        templateUrl: 'app/components/user/signup/user-signup.view.html',
        acl_bypass: true,
        translations: ['components/user']
    });
});