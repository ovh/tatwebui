/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('groups-new', {
    url: '/groups/new',
    templateUrl: 'app/components/groups/new/groups-new.view.html',
    translations: [
      'components/groups'
    ]
  });
});
