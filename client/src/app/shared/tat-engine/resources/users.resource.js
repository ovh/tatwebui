/*global angular*/

/**
 * @ngdoc resource
 * @name TatUi.resource:TatEngineUsersRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineUsersRsc', function($resource) {
  'use strict';
  return $resource('tatengine/users', {}, {

    /**
     * @ngdoc function
     * @name list
     * @methodOf TatUi.resource:TatEngineUsersRsc
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
 * @name TatUi.resource:TatEngineUserRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineUserRsc', function($resource) {
  'use strict';
  return $resource('tatengine/user/:action:topic:contact', {
    'contact': '@contat',
    'topic': '@topic',
  }, {

    /**
     * @ngdoc function
     * @name archive
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    archive: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'archive'
      }
    },

    /**
     * @ngdoc function
     * @name rename
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    rename: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'rename'
      }
    },

    /**
     * @ngdoc function
     * @name update
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    update: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'update'
      }
    },

    /**
     * @ngdoc function
     * @name setAdmin
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    setAdmin: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'setadmin'
      }
    },

    /**
     * @ngdoc function
     * @name convert
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    convert: {
      method: 'PUT',
      isArray: false,
      params: {
        action: 'convert'
      }
    },

    /**
     * @ngdoc function
     * @name addContact
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod POST
     * @description
     *
     * @return {object} Promise
     */
    addContact: {
      method: 'POST',
      isArray: false,
      params: {
        action: 'me/contacts/'
      }
    },

    /**
     * @ngdoc function
     * @name removeContact
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod DELETE
     * @description
     *
     * @return {object} Promise
     */
    removeContact: {
      method: 'DELETE',
      isArray: false,
      params: {
        action: 'me/contacts/'
      }
    },

    /**
     * @ngdoc function
     * @name addFavoriteTopic
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod POST
     * @description
     *
     * @return {object} Promise
     */
    addFavoriteTopic: {
      method: 'POST',
      isArray: false,
      params: {
        action: 'me/topics'
      }
    },

    /**
     * @ngdoc function
     * @name removeFavoriteTopic
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod DELETE
     * @description
     *
     * @return {object} Promise
     */
    removeFavoriteTopic: {
      method: 'DELETE',
      isArray: false,
      params: {
        action: 'me/topics'
      }
    },

    /**
     * @ngdoc function
     * @name enableNotificationsTopic
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod POST
     * @description
     *
     * @return {object} Promise
     */
    enableNotificationsTopic: {
      method: 'POST',
      isArray: false,
      params: {
        action: 'me/enable/notifications/topics'
      }
    },

    /**
     * @ngdoc function
     * @name disableNotificationsTopic
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod POST
     * @description
     *
     * @return {object} Promise
     */
    disableNotificationsTopic: {
      method: 'POST',
      isArray: false,
      params: {
        action: 'me/disable/notifications/topics'
      }
    },

    /**
     * @ngdoc function
     * @name enableNotificationsAllTopics
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod POST
     * @description
     *
     * @return {object} Promise
     */
    enableNotificationsAllTopics: {
      method: 'POST',
      isArray: false,
      params: {
        action: 'me/enable/notifications/alltopics'
      }
    },

    /**
     * @ngdoc function
     * @name disableNotificationsAllTopics
     * @methodOf TatUi.resource:TatEngineUserRsc
     * @restMethod POST
     * @description
     *
     * @return {object} Promise
     */
    disableNotificationsAllTopics: {
      method: 'POST',
      isArray: false,
      params: {
        action: 'me/disable/notifications/alltopics'
      }
    },
  });
});
