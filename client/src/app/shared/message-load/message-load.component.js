/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.shared:messageLoad
 * @restrict AE
 */
angular.module('TatUi').component('messageLoad', {
  bindings: {
    isInitLoading: '='
  },
  controllerAs: 'ctrl',
  controller: function(
    $scope
  ) {
    'use strict';

    var self = this;

  },
  templateUrl: 'app/shared/message-load/message-load.component.html'
});
