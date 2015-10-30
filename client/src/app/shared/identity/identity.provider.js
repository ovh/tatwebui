/*global angular*/

/**
 * @ngdoc service
 * @name TatUi.IdentityProvider
 * @module TatUi
 * @description
 *
 * Manage the identity of the user
 *
 */
angular.module('TatUi').provider('Identity', function() {
    'use strict';

    var identity = null;

    this.$get = function($cookieStore, $localStorage) {
        /**
         * @ngdoc service
         * @name TatUi.Identity
         * @module TatUi
         * @description
         *
         * Manage the identity of the user
         *
         */
        return {
            /**
             * @ngdoc function
             * @name checkPersistent
             * @methodOf TatUi.Identity
             * @module TatUi
             * @description
             *
             * Check user information were stored in the local storage.
             * If found, set the current identity
             */
            checkPersistent: function(force) {
                if ((!identity) || (force)) {
                    var persistentIdentity = $cookieStore.get('identity');
                    if (!persistentIdentity) {
                        persistentIdentity = $localStorage.identity;
                    }
                    identity = persistentIdentity ? persistentIdentity : identity;
                }
            },

            /**
             * @ngdoc function
             * @name hasIdentity
             * @methodOf TatUi.Identity
             * @module TatUi
             * @description
             *
             * Check if there is a current identity
             *
             * @return {bool} True if there is a current identity
             */
            hasIdentity: function() {
                return ((identity !== null) && (identity.dateCreation));
            },

            /**
             * @ngdoc function
             * @name killIdentity
             * @methodOf TatUi.Identity
             * @module TatUi
             * @description
             *
             * Destroy the current identity
             */
            killIdentity: function() {
                identity = null;
                $cookieStore.put('identity', null);
                $localStorage.identity = null;
            },

            /**
             * @ngdoc function
             * @name getIdentity
             * @methodOf TatUi.Identity
             * @module TatUi
             * @description
             *
             * Get the current identity
             *
             * @return {object} Current identity
             */
            getIdentity: function() {
                return identity;
            },

            /**
             * @ngdoc function
             * @name setIdentity
             * @methodOf TatUi.Identity
             * @module TatUi
             * @description
             *
             * Set the current identity
             *
             * @param {object} Identity to register as current
             */
            setIdentity: function(user) {
                identity = user;
                $cookieStore.put('identity', identity);
                if (user.remember) {
                    $localStorage.identity = identity;
                }
            }
        };
    };

});
