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
              if(e.which === 13) {
                  scope.$apply(function(){
                      scope.$eval(attrs.ngEnter, {'e': e});
                  });
                  e.preventDefault();
              }
          });
      };
});
