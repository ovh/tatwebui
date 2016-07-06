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
    $scope,
    TatEngineTopicsRsc,
    TatEngineUserRsc,
    TatEngine,
    Linker,
    Authentication) {
    'use strict';

    $scope.data = {
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
    $scope.init = function() {
      var criteria = {
        "topic": $scope.data.filtertopic,
        "getNbMsgUnread": true,
        "getForTatAdmin": $scope.data.getForTatAdmin
      };
      TatEngineTopicsRsc.list(criteria).$promise.then(function(data) {
        if (Authentication.getIdentity().favoritesTopics) {
          $scope.nextInit(data);
        } else {
          Authentication.refreshIdentity().then(
            function(data) {
              console.log("refreshing identity in topics list ok");
              $scope.nextInit(data);
            },
            function(err) {
              console.log("error while refreshing identity in topics list");
            });
        }
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    $scope.nextInit = function(data) {
      var favoriteTopics = Authentication.getIdentity().favoritesTopics;
      var offNotificationsTopics = Authentication.getIdentity().offNotificationsTopics;

      for (var i = 0; i < data.topics.length; i++) {
        if (!$scope.data.adminOfOneTopic && (data.topics[i].adminUsers || data.topics[i].adminGroups)) {
          $scope.data.adminOfOneTopic = true;
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

      $scope.data.topics = data.topics;
      $scope.data.count = data.count;
    };

    $scope.greaterThan = function(prop) {
      if ($scope.data.unreadOnly === true) {
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

    $scope.toggleAllNotificationsTopics = function(toEnable) {
      if (toEnable === true) {
        TatEngineUserRsc.enableNotificationsAllTopics().$promise.then(function() {
          $scope.init();
        });
      } else {
        TatEngineUserRsc.disableNotificationsAllTopics().$promise.then(function() {
          $scope.init();
        });
      }

    };

    $scope.toggleTopicFavorite = function(topic, isBatch) {
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

    $scope.toggleNotificationsTopic = function(topic, isBatch) {
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

    $scope.topicsAdminMode = function(isAdminMode) {
      $scope.data.getForTatAdmin = isAdminMode;
      $scope.init();
    };

    $scope.canView = function(topic) {
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

    $scope.init();
  });
