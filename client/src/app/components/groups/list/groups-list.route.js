/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('groups-list', {
    url: '/groups/list',
    templateUrl: 'app/components/groups/list/groups-list.view.html',
    translations: [
      'components/groups'
    ]
  });
});
