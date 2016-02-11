/*global angular*/

/**
 * @ngdoc resource
 * @name TatUi.resource:TatEngineTopicsRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineTopicsRsc', function($resource) {
  'use strict';
  return $resource('tatengine/topics', {}, {

    /**
     * @ngdoc function
     * @name list
     * @methodOf TatUi.resource:TatEngineTopicsRsc
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

/**
 * @ngdoc resource
 * @name TatUi.resource:TatEngineTopicRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineTopicRsc', function($resource) {
  'use strict';
  return $resource('tatengine/topic/:action', {}, {

    /**
     * @ngdoc function
     * @name create
     * @methodOf TatUi.resource:TatEngineTopicRsc
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
     * @name oneTopic
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod GET
     * @description Return only OneTopic
     *
     * @return {object} Promise
     */
    oneTopic: {
      method: 'GET',
      isArray: false
    },


    /**
     * @ngdoc function
     * @name addRoUser
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    addRoUser: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'add/rouser'
      }
    },

    /**
     * @ngdoc function
     * @name removeRoUser
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    removeRoUser: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'remove/rouser'
      }
    },

    /**
     * @ngdoc function
     * @name addRwUser
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    addRwUser: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'add/rwuser'
      }
    },

    /**
     * @ngdoc function
     * @name removeRwUser
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    removeRwUser: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'remove/rwuser'
      }
    },

    /**
     * @ngdoc function
     * @name addAdminUser
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    addAdminUser: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'add/adminuser'
      }
    },

    /**
     * @ngdoc function
     * @name removeAdminUser
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    removeAdminUser: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'remove/adminuser'
      }
    },

    /**
     * @ngdoc function
     * @name addRoGroup
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    addRoGroup: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'add/rogroup'
      }
    },

    /**
     * @ngdoc function
     * @name removeRoGroup
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    removeRoGroup: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'remove/rogroup'
      }
    },

    /**
     * @ngdoc function
     * @name addRwGroup
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    addRwGroup: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'add/rwgroup'
      }
    },

    /**
     * @ngdoc function
     * @name removeRwGroup
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    removeRwGroup: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'remove/rwgroup'
      }
    },

    /**
     * @ngdoc function
     * @name addAdminGroup
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    addAdminGroup: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'add/admingroup'
      }
    },

    /**
     * @ngdoc function
     * @name removeAdminGroup
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    removeAdminGroup: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'remove/admingroup'
      }
    },

    /**
     * @ngdoc function
     * @name addParameter
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    addParameter: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'add/parameter'
      }
    },

    /**
     * @ngdoc function
     * @name removeParameter
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    removeParameter: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'remove/parameter'
      }
    },

    /**
     * @ngdoc function
     * @name updateParam
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    updateParam: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'param'
      }
    },

    /**
     * @ngdoc function
     * @name truncate
     * @methodOf TatUi.resource:TatEngineTopicRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    truncate: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'truncate'
      }
    }
  });
});
