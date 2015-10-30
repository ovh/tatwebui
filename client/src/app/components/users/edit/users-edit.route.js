/*global angular*/
angular.module('TatUi').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('users-edit', {
        url: '/users/edit/:username',
        templateUrl: 'app/components/users/edit/users-edit.view.html',
        translations: [
            'components/users',
            'components/user'
        ]
    });
});
