/*global angular*/
angular.module('TatUi').directive('rdWidgetHeader', function rdWidgetTitle() {
  'use strict';
  var directive = {
    requires: '^rdWidget',
    scope: {
      title: '@',
      icon: '@'
    },
    transclude: true,
    template: '<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" data-ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" data-ng-transclude></div></div></div>',
    restrict: 'E'
  };
  return directive;
});
