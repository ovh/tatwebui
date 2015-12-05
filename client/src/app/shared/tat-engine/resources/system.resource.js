/*global angular*/

/**
 * @ngdoc resource
 * @name TatUi.resource:TatEngineSystemRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineSystemRsc', function($resource) {
  'use strict';
  return $resource('tatengine/:action', {}, {

    /**
     * @ngdoc function
     * @name version
     * @methodOf TatUi.resource:TatEngineSystemRsc
     * @restMethod GET
     * @description
     *
     * @return {object} Promise
     */
    version: {
      method: 'GET',
      isArray: false,
      params: {
        action: 'version'
      }
    },

    /** 
     * @ngdoc function
     * @name capatbilities
     * @methodOf TatUi.resource:TatEngineSystemRsc
     * @restMethod GET
     * @description
     *
     * @return {object} JSON with {"username_from_email":true,"websocket_enabled":false}
     */
    capabilities: {
      method: 'GET',
      isArray: false,
      params: {
        action: 'capabilities'
      }
    }
  });
});
