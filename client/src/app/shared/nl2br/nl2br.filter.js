/* global angular*/

/**
 * @ngdoc filter
 * @name TatUi.filter:nl2br
 *
 * @description
 * shorten a string if necessary. Just specify a leangth as parameter. If the string is shorten, '...' are added at the
 * end.
 *
 */
angular.module('TatUi').filter('nl2br', function($sanitize) {
  'use strict';
  var tag = (/xhtml/i).test(document.doctype) ? '<br />' : '<br>';
  return function(msg) {
    // ngSanitize's linky filter changes \r and \n to &#10; and &#13; respectively
    msg = (msg + '').replace(
      /(\r\n|\n\r|\r|\n|&#10;&#13;|&#13;&#10;|&#10;|&#13;)/g, tag +
      '$1');
    return $sanitize(msg);
  };
});
