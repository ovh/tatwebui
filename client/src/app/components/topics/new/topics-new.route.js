/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('topics-new', {
    url: '/topics/new{topicRoute:topicRoute}',
    templateUrl: 'app/components/topics/new/topics-new.view.html',
    translations: [
      'components/topics'
    ]
  });
});
