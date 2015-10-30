/*global angular*/

/**
 * @ngdoc service
 * @name TatUi.PluginProvider
 * @module TatUi
 * @description
 *
 * Manage the plugins
 *
 */
angular.module('TatUi').provider('Plugin', function() {
    'use strict';

    var plugins = [];
    var self = this;

    /**
     * @ngdoc function
     * @name addPlugin
     * @methodOf TatUi.PluginProvider
     * @module TatUi
     * @description register a new plugin
     * @param {object} pluginData Plugin description with fileds {name, type, description}
     */
    this.addPlugin = function(pluginData) {
        plugins.push(pluginData);
    };

    /**
     * @ngdoc function
     * @name getPluginsMessagesViews
     * @methodOf TatUi.PluginProvider
     * @module TatUi
     * @description get list of registered plugins of messages-views
     */
    this.getPluginsMessagesViews = function() {
        return _.filter(plugins, {"type": "messages-views"});
    };

    /**
     * @ngdoc function
     * @name getPluginByRoute
     * @methodOf TatUi.PluginProvider
     * @module TatUi
     * @description get a registered plugin by route name
     */
    this.getPluginByRoute = function(route) {
        var r = _.filter(plugins, {"route": route});
        if (r.length < 1) {
          return null;
        } else {
          return r[0];
        }
    };

    /**
     * @ngdoc function
     * @name getPlugin
     * @methodOf TatUi.PluginProvider
     * @module TatUi
     * @description register a new plugin
     * @param {object} filter Object to filter elements
     * @return {object} plugin description
     */
    this.getPlugin = function(filter) {
        return _.find(plugins, filter);
    };


    this.$get = function() {
        /**
         * @ngdoc service
         * @name TatUi.Plugin
         * @module TatUi
         * @description
         *
         * Manage the plugins
         *
         */
        return {

            /**
             * @ngdoc function
             * @name addPlugin
             * @methodOf TatUi.Plugin
             * @module TatUi
             * @description register a new plugin
             * @param {object} pluginData Plugin description with fileds {name, type, description}
             */
            addPlugin: self.addPlugin,

            /**
             * @ngdoc function
             * @name getPlugin
             * @methodOf TatUi.Plugin
             * @module TatUi
             * @description get a plugin
             * @param {object} filter Object to filter elements
             * @return {object} plugin description
             */
            getPlugin: self.getPlugin,

            /**
             * @ngdoc function
             * @name getPlugins
             * @methodOf TatUi.Plugin
             * @module TatUi
             * @description get list of plugins
             */
            getPlugins: self.getPlugins,

            /**
             * @ngdoc function
             * @name getPluginsMessagesViews
             * @methodOf TatUi.Plugin
             * @module TatUi
             * @description get list of plugins messages views
             */
            getPluginsMessagesViews: self.getPluginsMessagesViews,

            /**
             * @ngdoc function
             * @name getPluginByRoute
             * @methodOf TatUi.Plugin
             * @module TatUi
             * @description get a registered plugin by route name
             */
            getPluginByRoute : self.getPluginByRoute
        };
    };
});
