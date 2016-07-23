/**
 * @ngdoc service
 * @name TatUi.TatTopicProvider
 * @module TatUi
 * @description
 *
 * Compute Topic
 *
 */
angular.module('TatUi').provider('TatTopic', function(appConfiguration) {
  'use strict';

  var self = this;

  self.data = {
    topic: {},
    isTopicTasks: false,
    isTopicDeletableMsg: false,
    isTopicDeletableAllMsg: false,
    isTopicUpdatableMsg: false,
    isTopicUpdatableAllMsg: false,
    isTopicRw: true
  };

  return {

    $get: function($translate, $rootScope, TatEngineTopicRsc, Authentication, TatEngine) {

      self.getDataTopic = function() {
          return self.data;
      };

      self.computeTopic = function(topic, callback) {
        TatEngineTopicRsc.oneTopic({
          action: topic
        }).$promise.then(function(data) {
          if (!data.topic) {
            Flash.create('danger', $translate.instant('topics_notopic'));
            return;
          }
          self.data.topic = data.topic;
          self.data.isTopicUpdatableMsg = self.data.topic.canUpdateMsg;
          self.data.isTopicDeletableMsg = self.data.topic.canDeleteMsg;
          self.data.isTopicUpdatableAllMsg = self.data.topic.canUpdateAllMsg;
          self.data.isTopicDeletableAllMsg = self.data.topic.canDeleteAllMsg;
          if (self.data.topic.topic.indexOf("/Private/" +
              Authentication.getIdentity().username + "/Tasks") === 0) {
            self.data.isTopicTasks = true;
            self.data.isTopicDeletableMsg = true;
          } else if (self.data.topic.topic.indexOf("/Private/" +
              Authentication.getIdentity().username + "/DM/") === 0) {
            self.data.isTopicDeletableMsg = false;
          } else if (self.data.topic.topic.indexOf("/Private/" +
              Authentication.getIdentity().username) === 0) {
            self.data.isTopicDeletableMsg = true;
          }
          $rootScope.$broadcast("sidebar-change", self.data.topic.topic);
          if (callback) {
            callback();
          }
        }, function(err) {
          TatEngine.displayReturn(err);
        });
      };

      return {
        computeTopic: self.computeTopic,
        getDataTopic: self.getDataTopic
      };
    }
  };
});
