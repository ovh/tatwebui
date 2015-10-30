/*global angular*/
angular.module('TatUi').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('index', {
        url: '/',
        templateUrl: 'app/components/dashboard/dashboard.view.html',
        translations: [
            'components/dashboard'
        ]
    });
});
