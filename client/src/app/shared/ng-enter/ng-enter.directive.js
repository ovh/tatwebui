/* global angular*/

/**
 * @ngdoc filter
 * @name TatUi.filter:shortener
 *
 * @description
 *
 *
 */
angular.module('TatUi').directive('ngEnter', function() {
  'use strict';
  return function(scope, element, attrs) {
    element.bind("keydown", function(e) {
      var code = event.keyCode || event.which;
      if (e.which === 13) {
        if (!event.shiftKey) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter, {
              'e': e
            });
          });
          e.preventDefault();
        }
      }
    });
  };
});
