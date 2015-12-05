/* global angular*/

/**
 * @ngdoc directive
 * @name TatUi.directive:colorPicker
 *
 * @description Display color selector
 *
 */
angular.module('TatUi').directive('colorPicker', function() {
  var defaultColors = [
    '#7bd148',
    '#5484ed',
    '#a4bdfc',
    '#46d6db',
    '#7ae7bf',
    '#51b749',
    '#fbd75b',
    '#ffb878',
    '#ff887c',
    '#dc2127',
    '#dbadff',
    '#e1e1e1'
  ];
  return {
    scope: {
      selected: '=',
      customizedColors: '=colors'
    },
    restrict: 'AE',
    template: '<ul><li data-ng-repeat="color in colors" data-ng-class="{selected: (color===selected)}" data-ng-click="pick(color)" style="background-color:{{color}};"></li></ul>',
    link: function(scope, element, attr) {
      scope.colors = scope.customizedColors || defaultColors;
      scope.selected = scope.selected || scope.colors[0];
      scope.pick = function(color) {
        scope.selected = color;
      };
    }
  };
});
