/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('topics-list', {
    url: '/topics/list',
    templateUrl: 'app/components/topics/list/topics-list.view.html',
    controller: 'TopicsListCtrl',
    controllerAs: 'ctrl',
    translations: [
      'components/topics'
    ]
  });
});
