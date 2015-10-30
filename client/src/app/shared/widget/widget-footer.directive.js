/*global angular*/
angular.module('TatUi').directive('rdWidgetFooter', function rdWidgetFooter() {
    'use strict';
    var directive = {
        requires: '^rdWidget',
        transclude: true,
        template: '<div class="widget-footer" data-ng-transclude></div>',
        restrict: 'E'
    };
    return directive;
});
