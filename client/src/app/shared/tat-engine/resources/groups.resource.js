/*global angular*/

/**
 * @ngdoc resource
 * @name TatUi.resource:TatEngineGroupsRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineGroupsRsc', function($resource) {
  'use strict';
  return $resource('tatengine/groups', {}, {
    /**
     * @ngdoc function
     * @name list
     * @methodOf TatUi.resource:TatEngineGroupsRsc
     * @restMethod GET
     * @description
     *
     * @return {object} Promise
     */
    list: {
      method: 'GET',
      isArray: false,
      params: {
        limit: 1000
      }
    }
  });
});

/**
 * @ngdoc resource
 * @name TatUi.resource:TatEngineGroupRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineGroupRsc', function($resource) {
  'use strict';
  return $resource('tatengine/group/:action', {}, {

    /**
     * @ngdoc function
     * @name create
     * @methodOf TatUi.resource:TatEngineGroupRsc
     * @restMethod POST
     * @description
     *
     * @return {object} Promise
     */
    create: {
      method: 'POST',
      isArray: false,
      params: {
        action: ''
      }
    },

    /**
     * @ngdoc function
     * @name addUser
     * @methodOf TatUi.resource:TatEngineGroupRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    addUser: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'add/user'
      }
    },

    /**
     * @ngdoc function
     * @name removeUser
     * @methodOf TatUi.resource:TatEngineGroupRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    removeUser: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'remove/user'
      }
    },

    /**
     * @ngdoc function
     * @name addAdmin
     * @methodOf TatUi.resource:TatEngineGroupRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    addAdmin: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'add/adminuser'
      }
    },

    /**
     * @ngdoc function
     * @name removeAdmin
     * @methodOf TatUi.resource:TatEngineGroupRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    removeAdmin: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'remove/adminuser'
      }
    }
  });
});
