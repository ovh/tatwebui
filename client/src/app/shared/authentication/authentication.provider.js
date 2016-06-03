/*global angular*/

/**
 * @ngdoc service
 * @name TatUi.AuthenticationProvider
 * @module TatUi
 * @description
 *
 * Manage the authentication
 *
 */
angular.module('TatUi').provider('Authentication', function() {
  'use strict';
  var getUserInfo = function($q, AuthenticationRsc, Identity, user) {
    return $q(function(resolve, reject) {
      Identity.setIdentity(user);
      AuthenticationRsc.getInfo({}).$promise.then(function(data) {
        var identity = Identity.getIdentity();
        angular.extend(identity, data.user);
        Identity.setIdentity(identity);
        resolve(Identity.getIdentity());
      }, function(err) {
        Identity.killIdentity();
        reject(err);
      });
    });
  };

  var baseHref = function() {
    var bases = document.getElementsByTagName('base');
    var baseHref = null;

    if (bases.length > 0) {
      baseHref = bases[0].href;
    }
    return baseHref;
  }();

  this.$get = function($q, AuthenticationRsc, $location, Identity,
    WebSocket) {

    var callback = baseHref + 'user/confirm/:username/token/:token';

    /**
     * @ngdoc service
     * @name TatUi.Authentication
     * @module TatUi
     * @description
     *
     * Manage the authentication
     *
     */
    return {

      /**
       * @ngdoc function
       * @name isConnected
       * @methodOf TatUi.Authentication
       * @module TatUi
       * @description
       *
       * Check if the user is connected
       *
       * @return {bool} true if connected
       */
      isConnected: function() {
        Identity.checkPersistent();
        if (Identity.hasIdentity()) {
          //WebSocket.checkConnection();
        }
        return (Identity.hasIdentity());
      },

      /**
       * @ngdoc function
       * @name disconnect
       * @methodOf TatUi.Authentication
       * @module TatUi
       * @description
       *
       * Disconnect the user
       */
      disconnect: function() {
        Identity.killIdentity();
        //WebSocket.disconnect();
      },

      /**
       * @ngdoc function
       * @name getIdentity
       * @methodOf TatUi.Authentication
       * @module TatUi
       * @description
       *
       * Get information about the connected user
       *
       * @return {object} Connected user
       */
      getIdentity: function() {
        Identity.checkPersistent();
        return Identity.getIdentity();
      },

      /**
       * @ngdoc function
       * @name connect
       * @methodOf TatUi.Authentication
       * @module TatUi
       * @description
       *
       * Connect a user
       *
       * @param {object} user User to connect
       * @return {object} Promise
       */
      connect: function(user) {
        return $q.all([
          getUserInfo($q, AuthenticationRsc, Identity, user),
          //WebSocket.connect(user)
        ]);
      },

      /**
       * @ngdoc function
       * @name signup
       * @methodOf TatUi.Authentication
       * @module TatUi
       * @description
       *
       * Signup a new user
       *
       * @param {string} username Username
       * @param {string} fullname User fullname
       * @param {string} email    User email
       * @return {object} Promise
       */
      signup: function(username, fullname, email) {
        return AuthenticationRsc.signup({
          username: username,
          fullname: fullname,
          email: email,
          callback: callback
        }).$promise;
      },

      /**
       * @ngdoc function
       * @name verify
       * @methodOf TatUi.Authentication
       * @module TatUi
       * @description
       *
       * Verify the token that was provided by email
       *
       * @param {string} username Username
       * @param {string} token    Token that was provided by email
       * @return {object} Promise
       */
      verify: function(username, token) {
        return $q(function(resolve, reject) {
          AuthenticationRsc.verify({
            username: username,
            token: token
          }).$promise.then(function(data) {
            Identity.setIdentity(data);
            getUserInfo($q, AuthenticationRsc, Identity, data).then(
              function(usr) {
                resolve(usr);
              },
              function(err) {
                reject(err);
              });
          }, function(err) {
            Identity.killIdentity();
            reject(err);
          });
        });
      },

      /**
       * @ngdoc function
       * @name reset
       * @methodOf TatUi.Authentication
       * @module TatUi
       * @description
       *
       * Reset the password of a user
       *
       * @param {string} username Username
       * @param {string} email    User email
       * @return {object} Promise
       */
      reset: function(username, email) {
        return AuthenticationRsc.reset({
          username: username,
          email: email,
          callback: callback
        }).$promise;
      },

      /**
       * @ngdoc function
       * @name refreshIdentity
       * @methodOf TatUi.Authentication
       * @module TatUi
       * @description
       *
       * Sync identity with the api
       */
      refreshIdentity: function() {
        Identity.checkPersistent();
        return AuthenticationRsc.getInfo({}).$promise.then(function(data) {
          var id = Identity.getIdentity();
          if (id && data) {
            data.user.password = id.password;
            Identity.setIdentity(data.user);
          }
        }, function(err) {
          if (err && err.status == 401) {
            Identity.killIdentity();
          }
        });
      }
    };
  };

});
