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

    self.topics = {};

    return {
      $get: function(Authentication, Plugin, $localStorage, $state) {

        self.computeURL = function(topic) {
          var restrictedPlugin = Plugin.getPluginByRestriction(topic);
          if (restrictedPlugin) {
            self.topics[topic.topic] = restrictedPlugin.route;
            return $state.href(self.topics[topic.topic], {topic: topic.topic.substring(1)});
          }
          if ($localStorage && $localStorage.views && $localStorage.views[topic]) {
            if (!Plugin.getPluginByRoute($localStorage.views[topic])) {
              $localStorage.views[topic] = Plugin.getDefaultPlugin(data.topic).route;
            }
            self.topics[topic.topic] = $localStorage.views[topic.topic];
            return $state.href(self.topics[topic.topic], {topic: topic.topic.substring(1)});
          }
          self.topics[topic.topic] = Plugin.getDefaultPlugin(topic).route;
          return $state.href(self.topics[topic.topic], {topic: topic.topic.substring(1)});
        };

        self.computeURLDM = function(toUsername) {
          var me = Authentication.getIdentity().username;
          if (me !== toUsername) {
            return $state.href("standardview-list", {topic: 'Private/'+ me +'/DM/'+ toUsername});
          }
        };

        self.computeURLMessage = function($state, message) {
          return $state.href($state.current.name, {topic: message.topic.substring(1), idMessage: message._id});
        };

        self.getComputedURL = function(topicName) {
          var view = self.topics[topicName];
          if (view) {
            return $state.href(self.topics[topicName], {topic: topicName.substring(1) });
          }
          return $state.href("standardview-list", {topic: topicName.substring(1) });
        };

        return {
          getComputedURL: self.getComputedURL,
          computeURL: self.computeURL,
          computeURLDM: self.computeURLDM,
          computeURLMessage: self.computeURLMessage
        };
      }
    };
  });
