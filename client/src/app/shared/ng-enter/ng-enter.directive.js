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
      var code = e.keyCode || e.which;
      if (e.which === 13) {
        if (!e.shiftKey) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter, { 'e': e });
          });
          e.preventDefault();
        }
      }
    });
  };
});
