/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('topics-edit', {
    url: '/topics/edit/:topicId',
    templateUrl: 'app/components/topics/edit/topics-edit.view.html',
    translations: [
      'components/topics'
    ]
  });
});
