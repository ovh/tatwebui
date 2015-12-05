/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('tables', {
    url: '/tables',
    templateUrl: 'app/components/tables/tables.view.html'
  });
});
