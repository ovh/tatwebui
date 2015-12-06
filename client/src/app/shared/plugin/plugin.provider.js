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
    return _.filter(plugins, {
      'type': 'messages-views'
    });
  };

  // Internal method
  this.getPluginByTopicParam = function(topic, param) {
    var views = _.filter(plugins, {
      'type': 'messages-views'
    });
    var globalDefaultView = {};
    var defaultView;
    for (var i = 0; i < views.length; i++) {
      if (views[i].default === true) {
        globalDefaultView = views[i];
      }
      if (views[i].topic && views[i].topic[param]) {
        var re = new RegExp(views[i].topic[param]);
        if (topic.topic && topic.topic.match(re)) {
          defaultView = views[i];
          if (param !== 'default') {
            return defaultView;
          }
        }
      }
    }

    var pluginNameOnTopic = '';
    var pluginOnTopic;
    if (topic.parameters) {
      for (var j = 0; j < topic.parameters.length; j++) {
        if (topic.parameters[j].key === 'tatwebui.view.' + param) {
          pluginNameOnTopic = topic.parameters[j].value;
          pluginOnTopic = this.getPluginByRoute(pluginNameOnTopic);
          break;
        }
      }

    }
    if (!pluginOnTopic && param === 'default') {
      return globalDefaultView;
    } else if (!pluginOnTopic && defaultView) {
      return defaultView;
    } else if (pluginOnTopic) {
      return pluginOnTopic;
    } else if (param == 'restricted') {
      return undefined;
    }
    return globalDefaultView;
  };

  /**
   * @ngdoc function
   * @name getPluginByRestriction
   * @methodOf TatUi.PluginProvider
   * @module TatUi
   * @description returns view if there's a view restriction on topic
   */
  this.getPluginByRestriction = function(topic) {
    return self.getPluginByTopicParam(topic, 'restricted');
  };

  /**
   * @ngdoc function
   * @name getDefaultPlugin
   * @methodOf TatUi.PluginProvider
   * @module TatUi
   * @description returns default view for topic
   */
  this.getDefaultPlugin = function(topic) {
    return self.getPluginByTopicParam(topic, 'default');
  };

  /**
   * @ngdoc function
   * @name getPluginByRoute
   * @methodOf TatUi.PluginProvider
   * @module TatUi
   * @description get a registered plugin by route name
   */
  this.getPluginByRoute = function(route) {
    var r = _.filter(plugins, {
      'route': route
    });
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
       * @name getDefaultPlugin
       * @methodOf TatUi.PluginProvider
       * @module TatUi
       * @description returns view if there's a view restriction on topic
       */
      getPluginByRestriction: self.getPluginByRestriction,

      /**
       * @ngdoc function
       * @name getDefaultPlugin
       * @methodOf TatUi.PluginProvider
       * @module TatUi
       * @description returns default view for topic
       */
      getDefaultPlugin: self.getDefaultPlugin,

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
      getPluginByRoute: self.getPluginByRoute
    };
  };
});
