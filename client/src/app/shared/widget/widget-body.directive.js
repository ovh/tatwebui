/*global angular*/
angular.module('TatUi').directive('rdWidgetBody', function rdWidgetBody() {
  'use strict';
  var directive = {
    requires: '^rdWidget',
    scope: {
      loading: '@?',
      classes: '@?'
    },
    transclude: true,
    template: '<div class="widget-body" data-ng-class="classes"><rd-loading data-ng-show="loading"></rd-loading><div data-ng-hide="loading" class="widget-content" data-ng-transclude></div></div>',
    restrict: 'E'
  };
  return directive;
});
