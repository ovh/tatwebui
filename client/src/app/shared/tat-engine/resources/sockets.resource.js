/*global angular*/

/**
 * @ngdoc resource
 * @name TatUi.resource:TatEngineSocketsRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineSocketsRsc', function($resource) {
  'use strict';
  return $resource('tatengine/sockets/:action', {
    'action': 'dump'
  }, {

    /**
     * @ngdoc function
     * @name actionDump
     * @methodOf TatUi.resource:TatEngineSocketsRsc
     * @restMethod GET
     * @description
     *
     * @return {object} Promise
     */
    actionDump: {
      method: 'GET',
      isArray: false
    }
  });
});
