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
    isTopicRw: true,
    isUserAdminOnTopic: false
  };

  return {

    $get: function($translate, $rootScope, TatEngineTopicRsc, Authentication, TatEngine) {

      // return true if user is admin on topic (group admin or admin user)
      self.isUserAdminOnTopic = function() {
        if (Authentication.getIdentity().isAdmin === true) {
          return true;
        }
        var userGroups = Authentication.getIdentity().groups;
        if (userGroups && userGroups.length > 0 && self.data.topic.adminGroups && self.data.topic.adminGroups.length > 0) {
          for (var i = 0; i < self.data.topic.adminGroups.length; i++) {
            var groupTopic = self.data.topic.adminGroups[i];
            for (var j = 0; j < userGroups.length; i++) {
              var ugroup = userGroups[j];
              if (ugroup === groupTopic) {
                return true;
              }
            }
          }
        }

        if (_.includes(self.data.topic.adminUsers, Authentication.getIdentity().username) ||
          (self.data.topic.topic.indexOf("/Private/" + Authentication.getIdentity().username) === 0 &&
            self.data.topic.topic.indexOf("/Private/" + Authentication.getIdentity().username + "/DM") !== 0)
          ) {
          return true;
        }
        return false;
      };

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
          var privateTopic = "/Private/" + Authentication.getIdentity().username;
          self.data.topic = data.topic;
          self.data.isTopicUpdatableMsg = self.data.topic.canUpdateMsg;
          self.data.isTopicDeletableMsg = self.data.topic.canDeleteMsg;
          self.data.isTopicUpdatableAllMsg = self.data.topic.canUpdateAllMsg;
          self.data.isTopicDeletableAllMsg = self.data.topic.canDeleteAllMsg;
          self.data.isTopicAdminUpdatableAllMsg = self.data.topic.adminCanUpdateAllMsg;
          self.data.isTopicAdminDeletableAllMsg = self.data.topic.adminCanDeleteAllMsg;
          if (self.data.topic.topic.indexOf(privateTopic + "/Tasks") === 0) {
            self.data.isTopicTasks = true;
            self.data.isTopicDeletableMsg = true;
          } else if (self.data.topic.topic.indexOf(privateTopic + "/DM/") === 0) {
            self.data.isTopicDeletableMsg = false;
          } else if (self.data.topic.topic.indexOf(privateTopic) === 0) {
            self.data.isTopicDeletableMsg = true;
          }
          self.data.isUserAdminOnTopic = self.isUserAdminOnTopic();
          if (self.data.isUserAdminOnTopic === true) {
             if (self.data.topic.adminCanDeleteAllMsg === true) {
               self.data.isTopicDeletableAllMsg = true;
             }
             if (self.data.topic.adminCanUpdateAllMsg === true) {
               self.data.isTopicUpdatableAllMsg = true;
             }
          }
          $rootScope.$broadcast("sidebar-change", self.data.topic.topic);
          if (callback) {
            callback(self.data.topic);
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
