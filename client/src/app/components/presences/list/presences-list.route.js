/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('presences-list', {
    url: '/presences/list/{topic:.*}',
    templateUrl: 'app/components/presences/list/presences-list.view.html',
    translations: [
      'components/presences'
    ]
  });
});
