/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:TopicsListCtrl
 * @requires TatUi.TatEngineTopicsRsc Tat Engine Topics Resource
 * @requires TatUi.TatEngine          Tat Engine Provider
 * @description Topics List Controller
 */
angular.module('TatUi')
  .controller('TopicsListCtrl', function(
    TatEngineTopicsRsc,
    TatEngineUserRsc,
    TatEngine,
    Linker,
    Authentication
  ) {
    'use strict';

    var self = this;

    self.data = {
      filtertopic: "",
      getForTatAdmin: false,
      adminOfOneTopic: false,
      filterList: "",
      unreadOnly: false
    };

    /**
     * @ngdoc function
     * @name init
     * @methodOf TatUi.controller:TopicsListCtrl
     * @description initialize Topics List Page.
     */
    self.init = function() {
      Authentication.refreshIdentity().then(
        function(data) {
          var criteria = {
            "topic": self.data.filtertopic,
            "getNbMsgUnread": true,
            "getForTatAdmin": self.data.getForTatAdmin
          };
          TatEngineTopicsRsc.list(criteria).$promise.then(function(data) {
            self.nextInit(data);
          }, function(err) {
            TatEngine.displayReturn(err);
          });
        },
        function(err) {
          TatEngine.displayReturn(err);
        });
    };

    self.nextInit = function(data) {
      var favoriteTopics = Authentication.getIdentity().favoritesTopics;
      var offNotificationsTopics = Authentication.getIdentity().offNotificationsTopics;

      for (var i = 0; i < data.topics.length; i++) {
        if (!self.data.adminOfOneTopic && (data.topics[i].adminUsers || data.topics[i].adminGroups)) {
          self.data.adminOfOneTopic = true;
        }
        data.topics[i].isFavoriteTopic = false;
        data.topics[i].url = Linker.computeURL(data.topics[i]);
        if (favoriteTopics) {
          for (var j = 0; j < favoriteTopics.length; j++) {
            if (favoriteTopics[j] === data.topics[i].topic) {
              data.topics[i].isFavoriteTopic = true;
              break;
            }
          }
        }

        data.topics[i].isNotificationsOffTopic = false;
        if (offNotificationsTopics) {
          for (var k = 0; k < offNotificationsTopics.length; k++) {
            if (offNotificationsTopics[k] === data.topics[i].topic) {
              data.topics[i].isNotificationsOffTopic = true;
              break;
            }
          }
        }
        self.addUnRead(data.topics[i], data.topicsMsgUnread);
      }

      self.data.topics = data.topics;
      self.data.count = data.count;
    };

    self.greaterThan = function(prop) {
      if (self.data.unreadOnly === true) {
        return function(item){
          return item[prop] > 0;
        };
      }
    };

    self.addUnRead = function(topic, listUnread) {
      if (listUnread !== undefined && listUnread !== null && listUnread[topic.topic] !== undefined) {
        topic.unRead = listUnread[topic.topic];
      }
    };

    self.toggleAllNotificationsTopics = function(toEnable) {
      if (toEnable === true) {
        TatEngineUserRsc.enableNotificationsAllTopics().$promise.then(function() {
          self.init();
        });
      } else {
        TatEngineUserRsc.disableNotificationsAllTopics().$promise.then(function() {
          self.init();
        });
      }
    };

    self.toggleTopicFavorite = function(topic, isBatch) {
      if (topic.isFavoriteTopic) {
        TatEngineUserRsc.removeFavoriteTopic({
          'topic': topic.topic
        }).$promise.then(function() {
          topic.isFavoriteTopic = false;
          if (isBatch === false) {
            Authentication.refreshIdentity();
          }
        });
      } else {
        TatEngineUserRsc.addFavoriteTopic({
          'topic': topic.topic
        }).$promise.then(function() {
          topic.isFavoriteTopic = true;
          if (isBatch === false) {
            Authentication.refreshIdentity();
          }
        });
      }
    };

    self.toggleNotificationsTopic = function(topic, isBatch) {
      if (topic.isNotificationsOffTopic) {
        TatEngineUserRsc.enableNotificationsTopic({
          'topic': topic.topic
        }).$promise.then(function() {
          topic.isNotificationsOffTopic = false;
          if (isBatch === false) {
            Authentication.refreshIdentity();
          }
        });
      } else {
        TatEngineUserRsc.disableNotificationsTopic({
          'topic': topic.topic
        }).$promise.then(function() {
          topic.isNotificationsOffTopic = true;
          if (isBatch === false) {
            Authentication.refreshIdentity();
          }
        });
      }
    };

    self.topicsAdminMode = function(isAdminMode) {
      self.data.getForTatAdmin = isAdminMode;
      self.init();
    };

    self.canView = function(topic) {
      if (topic.topic.indexOf("/Private/" + Authentication.getIdentity().username + "/DM") === 0) {
        return false;
      }
      if (topic.topic.indexOf("/Private/" + Authentication.getIdentity().username) === 0) {
        return true;
      }
      return topic.adminUsers || topic.adminGroups ||
        topic.roUsers ||
        topic.rwUsers ||
        topic.roGroups ||
        topic.rwGroups;
    };

    self.init();
  });
