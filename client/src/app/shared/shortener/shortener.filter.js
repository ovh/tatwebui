/* global angular*/

/**
 * @ngdoc filter
 * @name TatUi.filter:shortener
 *
 * @description
 * shorten a string if necessary. Just specify a leangth as parameter. If the string is shorten, '...' are added at the
 * end.
 *
 */
angular.module('TatUi').filter('shortener', function() {
  'use strict';
  return function(input, length) {
    return input.substr(0, length) + (input.length > length ? '...' : '');
  };
});
