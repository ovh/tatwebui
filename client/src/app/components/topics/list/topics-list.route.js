/*global angular*/
angular.module('TatUi').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('topics-list', {
        url: '/topics/list',
        templateUrl: 'app/components/topics/list/topics-list.view.html',
        translations: [
            'components/topics'
        ]
    });
});
