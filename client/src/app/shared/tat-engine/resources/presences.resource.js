/*global angular*/

/**
 * @ngdoc resource
 * @name TatUi.resource:TatEnginePresencesRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEnginePresencesRsc', function($resource) {
  'use strict';
  return $resource('tatengine/presences/:topic', {
    'topic': '@topic'
  }, {

    /**
     * @ngdoc function
     * @name list
     * @methodOf TatUi.resource:TatEnginePresencesRsc
     * @restMethod GET
     * @description
     *
     * @return {object} Promise
     */
    list: {
      method: 'GET',
      isArray: false
    }
  });
});
