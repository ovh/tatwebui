/*global angular*/

angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('groups-edit', {
    url: '/groups/edit/:groupId',
    templateUrl: 'app/components/groups/edit/groups-edit.view.html',
    translations: [
      'components/groups'
    ]
  });
});
