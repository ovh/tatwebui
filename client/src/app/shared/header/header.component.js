/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.shared:header
 * @description
 * header
 */
angular.module('TatUi').component('header', {
  controllerAs: 'ctrl',
  controller: function(
    $scope,
    $rootScope,
    Authentication,
    appConfiguration,
    TatEngine,
    TatEngineUserRsc,
    TatEngineTopicRsc,
    Plugin,
    Flash,
    $state,
    $translate,
    $stateParams,
    $localStorage
  ) {
    'use strict';
    var self = this;

    this.data = {
      toggle: true,
      isPresencesOpen: false,
      viewsEnabled: false,
      bottomMenu: [],
      isFavoriteTopic: false,
      isNotificationsOffTopic: false,
      loading: false,
      topic: {},
      views: []
    };

    self.getUser = function(field) {
      var identity = Authentication.getIdentity();
      return identity[field] ? identity[field] : '';
    };

    self.togglePresences = function() {
      this.data.isPresencesOpen = !this.data.isPresencesOpen;
      $rootScope.$broadcast("presences-toggle", true);
    };

    self.toggleTopicFavorite = function() {
      if (self.data.isFavoriteTopic) {
        TatEngineUserRsc.removeFavoriteTopic({
          'topic': '/' + self.topic
        }).$promise.then(function() {
          self.data.isFavoriteTopic = false;
          $rootScope.$broadcast('sidebar-reload', true);
        });
      } else {
        TatEngineUserRsc.addFavoriteTopic({
          'topic': '/' + self.topic
        }).$promise.then(function() {
          self.data.isFavoriteTopic = true;
          $rootScope.$broadcast('sidebar-reload', true);
        });
      }
    };

    self.toggleNotificationsTopic = function() {
      if (self.data.isNotificationsOffTopic) {
        TatEngineUserRsc.enableNotificationsTopic({
          'topic': '/' + self.topic
        }).$promise.then(function() {
          self.data.isNotificationsOffTopic = false;
          Authentication.refreshIdentity();
        });
      } else {
        TatEngineUserRsc.disableNotificationsTopic({
          'topic': '/' + self.topic
        }).$promise.then(function() {
          self.data.isNotificationsOffTopic = true;
          Authentication.refreshIdentity();
        });
      }
    };

    self.getViews = function() {
      var restrictedPlugin = Plugin.getPluginByRestriction(self.data.topic);
      if (restrictedPlugin) {
        self.data.viewsEnabled = false;
        return null;
      }
      self.data.viewsEnabled = true;
      return self.data.views;
    };

    self.switchView = function(route) {
      if (!$localStorage.views) {
        $localStorage.views = {};
      }
      $localStorage.views[$stateParams.topic] = route;

      $state.go(route, {
        topic: $stateParams.topic
      }, {
        inherit: false,
        reload: false
      });
    };

    self.isMessagesView = function(route) {
      return Plugin.getPluginByRoute(route);
    };

    self.topicClickHeader = function(topic, sub, pos) {
      var t = "";
      for (var i = 0; i <= pos; i++) {
        t += "/" + $scope.title[i];
      }

      $state.go("standardview-list", {
        topic: t.substring(1)
      }, {
        inherit: false,
        reload: false
      });
    };

    self.getTitle = function(route) {
      var p = Plugin.getPluginByRoute(route);
      if (p) {
        return p.name;
      }
      return '';
    };

    self.isAdmin = function() {
      if (Authentication.isConnected()) {
        return Authentication.getIdentity().isAdmin;
      }
      return false;
    };

    self.canEditTopic = function(topic) {
      if (!topic.topic) {
        return;
      }
      if (self.isAdmin() || _.includes(topic.adminUsers,
          Authentication.getIdentity().username) ||
          (topic.topic.indexOf("/Private/" + Authentication.getIdentity().username) === 0 &&
           topic.topic.indexOf("/Private/" + Authentication.getIdentity().username + "/DM") !== 0
          )
        ) {
        // FIXME check group of user. _.includes($scope.topic.adminGroups, Authentication.getIdentity().groups)
        return true;
      }
      return false;
    };

    this.isPluginViewRoute = function(route) {
      for (var i = 0; i < self.data.views.length; i++) {
        if (self.data.views[i].route == route) {
          return true;
        }
      }
      return false;
    };

    $rootScope.$on('$stateChangeSuccess',
      function(e, toState, params) {
        $scope.path = toState.name.split('-');
        self.data.state = toState.name;

        if (self.isPluginViewRoute(toState.name)) {
          $rootScope.$broadcast('topicChangeRoute', params.topic);
          self.topic = params.topic;

          TatEngineTopicRsc.oneTopic({
            action: self.topic
          }).$promise.then(function(data) {
            if (!data.topic) {
              Flash.create('danger', $translate.instant('topics_notopic'));
              return;
            }
            self.data.topic = data.topic;
            $rootScope.$broadcast('sidebar-change', {topic: self.data.topic});

            $scope.title = params.topic.split('/');
            if (Authentication.getIdentity().favoritesTopics) {
              self.endLoadStateChangeSuccess(toState, params);
            } else {
              Authentication.refreshIdentity().then(
                function(data) {
                  self.endLoadStateChangeSuccess(toState, params);
                },
                function(err) {
                  console.log("error while refreshing identity in stateChangeSuccess");
                });
            }
          }, function(err) {
            TatEngine.displayReturn(err);
          });
        } else {
          $scope.title = toState.name;
        }
      }
    );

    this.endLoadStateChangeSuccess = function(toState, params) {
      self.data.favoriteTopics = Authentication.getIdentity().favoritesTopics;
      self.data.offNotificationsTopics = Authentication.getIdentity().offNotificationsTopics;
      self.data.isFavoriteTopic = false;
      self.data.isNotificationsOffTopic = false;
      if (!self.data.favoriteTopics) {
        self.data.favoriteTopics = [];
      }
      if (!self.data.offNotificationsTopics) {
        self.data.offNotificationsTopics = [];
      }
      for (var i = 0; i < self.data.favoriteTopics.length; i++) {
        if (self.data.favoriteTopics[i] === '/' + params.topic) {
          self.data.isFavoriteTopic = true;
        }
      }
      for (i = 0; i < self.data.offNotificationsTopics.length; i++) {
        if (self.data.offNotificationsTopics[i] === '/' + params.topic) {
          self.data.isNotificationsOffTopic = true;
        }
      }

      var restrictedPlugin = Plugin.getPluginByRestriction(self.data.topic);
      if (restrictedPlugin && restrictedPlugin.route != toState.name) {
        $state.go(restrictedPlugin.route, {
          topic: params.topic
        }, {
          inherit: false,
          reload: false
        });
        return;
      }
    };

    $scope.$on('loading', function(e, status) {
      self.data.loading = status;
    });

    self.init = function() {
      self.data.bottomMenu = [];
      if (appConfiguration.links && appConfiguration.links.menu) {
        self.data.bottomMenu = appConfiguration.links.menu;
      }

      var viewsPlugins = Plugin.getPluginsMessagesViews();
      if (viewsPlugins) {
        for (var i = 0; i < viewsPlugins.length; i++) {
          self.data.views.push(viewsPlugins[i]);
        }
      }
    };

    self.init();
  },
  templateUrl: 'app/shared/header/header.component.html'
});
