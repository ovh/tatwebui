/*global angular*/
angular.module('TatUi').config(function($stateProvider) {
  'use strict';
  $stateProvider.state('sockets-admin', {
    url: '/sockets/admin',
    templateUrl: 'app/components/sockets/admin/sockets-admin.view.html',
    translations: [
      'components/sockets'
    ]
  });
});
