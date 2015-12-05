/*global angular*/

/**
 * @ngdoc resource
 * @name TatUi.TatEngineMessagesRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineMessagesRsc', function($resource) {
  'use strict';
  return $resource('tatengine/messages/:topic', {
    'topic': '@topic'
  }, {

    /**
     * @ngdoc function
     * @name list
     * @methodOf TatUi.TatEngineMessagesRsc
     * @restMethod GET
     * @description
     *
     * @return {object} Promise
     */
    list: {
      method: 'GET',
      isArray: false,
      params: {
        "presence": "online"
      }
    }
  });
});


/**
 * @ngdoc resource
 * @name TatUi.resource:TatEngineMessageRsc
 * @module TatUi
 * @description
 *
 */
angular.module('TatUi').service('TatEngineMessageRsc', function($resource) {
  'use strict';

  return $resource("tatengine/message/:idMessage:topic", {
    'topic': '@topic',
    'idMessage': '@idMessage'
  }, {
    /**
     * @ngdoc function
     * @name create
     * @methodOf TatUi.resource:TatEngineMessageRsc
     * @restMethod POST
     * @description
     *
     * @return {object} Promise
     */
    create: {
      method: 'POST',
      isArray: false
    },

    /**
     * @ngdoc function
     * @name update
     * @methodOf TatUi.resource:TatEngineMessageRsc
     * @restMethod PUT
     * @description
     *
     * @return {object} Promise
     */
    update: {
      method: 'PUT',
      isArray: false
    },

    /**
     * @ngdoc function
     * @name remove
     * @methodOf TatUi.resource:TatEngineMessageRsc
     * @restMethod DELETE
     * @description
     *
     * @return {object} Promise
     */
    remove: {
      method: 'DELETE',
      isArray: false
    }
  });

});
