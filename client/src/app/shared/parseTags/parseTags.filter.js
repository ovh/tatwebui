/* global angular*/

/**
 * @ngdoc filter
 * @name TatUi.filter:parseTags
 *
 * @description
 * Replace url with <a href="url">...</a> in text, urls listed in tab urls
 *
 */
angular.module('TatUi').filter('parseTags', function() {
  'use strict';
  return function(text, tags) {
    if (!tags) {
      return text;
    }
    for (var i = 0; i < tags.length; i++) {
      text = text.replace('#' + tags[i], '<div class="tat-tag"><i>#</i>' + tags[i] + '</div>');
    }
    return text;
  };
});
