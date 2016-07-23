/*global angular*/
angular.module('TatUi').service('AuthenticationRsc', function($resource) {
  'use strict';
  /**
   * @ngdoc service
   * @name TatUi.AuthenticationRsc
   * @module TatUi
   * @description
   *
   * Resource to authenticate
   *
   */
  return $resource('tatengine/user', {}, {
    /**
     * @ngdoc function
     * @name signup
     * @methodOf TatUi.AuthenticationRsc
     * @module TatUi
     * @description
     *
     * (GET) Signup a user
     *
     */
    signup: {
      method: 'POST',
      isArray: false
    },

    /**
     * @ngdoc function
     * @name verify
     * @methodOf TatUi.AuthenticationRsc
     * @module TatUi
     * @description
     *
     * (GET) Check the tocken recieved by email
     *
     */
    verify: {
      method: 'GET',
      isArray: false,
      url: 'tatengine/user/verify/:username/:token'
    },

    /**
     * @ngdoc function
     * @name getInfo
     * @methodOf TatUi.AuthenticationRsc
     * @module TatUi
     * @description
     *
     * (GET) Get user information
     *
     */
    getInfo: {
      method: 'GET',
      isArray: false,
      url: 'tatengine/user/me'
    },

    /**
     * @ngdoc function
     * @name reset
     * @methodOf TatUi.AuthenticationRsc
     * @module TatUi
     * @description
     *
     * (POST) Reset the password
     *
     */
    reset: {
      method: 'POST',
      isArray: false,
      url: 'tatengine/user/reset'
    }
  });
});
