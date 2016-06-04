/*global angular*/
angular.module('TatUi').directive('rdWidget', function rdWidget() {
    'use strict';
    var directive = {
        transclude: true,
        template: '<div class="widget" data-ng-transclude></div>',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
        /* */
    }
});
