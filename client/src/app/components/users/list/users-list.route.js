/*global angular*/
angular.module('TatUi').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('users-list', {
        url: '/users/list',
        templateUrl: 'app/components/users/list/users-list.view.html',
        translations: [
            'components/users'
        ]
    });
});
