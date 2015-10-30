/*global angular,console */

/**
 * @ngdoc service
 * @name TatUi.TatEngineInterceptor
 * @module TatUi
 * @description
 * Http interceptor to transform uri tatengine/* to TatEngine uri
 *
 */
angular.module('TatUi')
    .service('TatEngineInterceptor', function(TatEngine, Identity) {
        'use strict';

        // use to convert %2F to / in request to Tat Engine
        var realEncodeURIComponent = window.encodeURIComponent;

        /**
         * @ngdoc function
         * @name request
         * @methodOf TatUi.TatEngineInterceptor
         * @module TatUi
         * @description
         *
         * Interception process
         * Add Tat_username and Tat_password to headers send to Tat Engine.
         * Convert %2F to /, in each request send to Tat Engine.
         *
         * @param {object} config Http config
         * @return {object} transformed http config
         */
        this.request = function(config) {
            var regex = /^tatengine/;
            if (regex.test(config.url)) {
                var user = Identity.getIdentity();
                if (user) {
                    config.headers.Tat_username = user.username;
                    config.headers.Tat_password = user.password;
                }
                config.url = TatEngine.buildUrl(config.url.replace(regex, ''));

                window.encodeURIComponent = function(input) {
                    return realEncodeURIComponent(input).replace(/\%2F/g, '/');
                };
            }

            return config;
        };
    });
