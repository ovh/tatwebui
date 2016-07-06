/**
 * @ngdoc service
 * @name TatUi.LinkerProvider
 * @module TatUi
 * @description
 *
 * Compute URL
 *
 */
angular.module('TatUi').provider('Linker', function() {
    'use strict';

    var self = this;

    return {
      $get: function(Authentication, Plugin, $localStorage, $state) {

        self.computeURL = function(topic) {
          var restrictedPlugin = Plugin.getPluginByRestriction(topic);
          if (restrictedPlugin) {
            return $state.href(restrictedPlugin.route, {topic: topic.topic.substring(1)});
          }
          if ($localStorage && $localStorage.views && $localStorage.views[topic]) {
            if (!Plugin.getPluginByRoute($localStorage.views[topic])) {
              $localStorage.views[topic] = Plugin.getDefaultPlugin(data.topic).route;
            }
            return $state.href($localStorage.views[topic.topic], {topic: topic.topic.substring(1)});
          }
          return $state.href(Plugin.getDefaultPlugin(topic).route, {topic: topic.topic.substring(1)});
        };

        self.computeURLDM = function(toUsername) {
          var me = Authentication.getIdentity().username;
          if (me !== toUsername) {
            return $state.href("standardview", {topic: 'Private/'+ me +'/DM/'+ toUsername});
          }
        };

        return {
          computeURL: self.computeURL,
          computeURLDM: self.computeURLDM
        };
      }
    };
  });
