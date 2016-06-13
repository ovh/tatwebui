/*global angular */
angular.module('TatUi')
  .controller('MasterCtrl', function MasterCtrl(
    $scope,
    $rootScope,
    Authentication,
    $state,
    appConfiguration,
    TatEngineUserRsc,
    TatEngine,
    TatEngineTopicRsc,
    TatEnginePresencesRsc,
    $cookieStore,
    Flash,
    Plugin,
    $localStorage,
    $stateParams,
    $translate
  ) {
    'use strict';

    var self = this;

    this.loading = false;
    this.data = {
      isFavoriteTopic: false,
      isNotificationsOffTopic: false,
      isPresencesOpen: false,
      topic: {},
      toggle: true,
      viewsEnabled: false
    };

    var views = [];

    var viewsPlugins = Plugin.getPluginsMessagesViews();
    if (viewsPlugins) {
      for (var i = 0; i < viewsPlugins.length; i++) {
        views.push(viewsPlugins[i]);
      }
    }

    if (angular.isDefined($cookieStore.get('toggle'))) {
      self.data.toggle = $cookieStore.get('toggle');
    }

    $scope.$on('toggle', function(ev, toggleValue) {
      self.data.toggle = toggleValue;
    });

    $scope.topicClick = function(topic) {
      $rootScope.$broadcast('topic-change', {topic: topic});
    };

    $scope.topicClickHeader = function(topic, sub, pos) {
      var t = "";
      for (var i = 0; i <= pos; i++) {
        t += "/" + $scope.title[i];
      }
      return $scope.topicClick(t);
    };

    $scope.canEditTopic = function(topic) {
      if (!topic.topic) {
        return;
      }
      if ($scope.isAdmin() || _.includes(topic.adminUsers,
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

    $scope.getTitle = function(route) {
      var p = Plugin.getPluginByRoute(route);
      if (p) {
        return p.name;
      }
      return '';
    };

    $scope.isMessagesView = function(route) {
      return Plugin.getPluginByRoute(route);
    };

    $scope.bottomMenu = [];
    if (appConfiguration.links && appConfiguration.links.menu) {
      $scope.bottomMenu = appConfiguration.links.menu;
    }

    $scope.directMessage = function(username) {
      var me = Authentication.getIdentity().username;
      if (me !== username) {
        $rootScope.$broadcast('topic-change', {
          topic: 'Private/'+ me +'/DM/'+ username
        });
      }
    };

    $scope.getViews = function() {
      var restrictedPlugin = Plugin.getPluginByRestriction(self.data.topic);
      if (restrictedPlugin) {
        self.data.viewsEnabled = false;
        return null;
      }
      self.data.viewsEnabled = true;
      return views;
    };

    $scope.switchView = function(route) {
      if (!$localStorage.views) {
        $localStorage.views = {};
      }
      $localStorage.views[$stateParams.topic] = route;
      $rootScope.$broadcast('topic-change', {
        topic: $stateParams.topic
      });
    };

    $scope.isConnected = function() {
      return Authentication.isConnected();
    };

    $scope.getUser = function(field) {
      var identity = Authentication.getIdentity();
      return identity[field] ? identity[field] : '';
    };

    $scope.isAdmin = function() {
      if (Authentication.isConnected()) {
        return Authentication.getIdentity().isAdmin;
      }
      return false;
    };

    this.toggleTopicFavorite = function() {
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

    this.toggleNotificationsTopic = function() {
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

    this.isPluginViewRoute = function(route) {
      for (var i = 0; i < views.length; i++) {
        if (views[i].route == route) {
          return true;
        }
      }
      return false;
    };

    this.togglePresences = function() {
      this.data.isPresencesOpen = !this.data.isPresencesOpen;
      $rootScope.$broadcast("presences-toggle", true);
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

    $scope.$on('topic-change', function(e, meta) {
      var topic = meta.topic.replace(/^\//, '');
      var idMessage = meta.idMessage;
      var reload = false;
      if (meta.reload) {
        reload = true;
      }

      TatEngineTopicRsc.oneTopic({
        action: topic
      }).$promise.then(function(data) {
        if (!data.topic) {
          Flash.create('danger', $translate.instant('topics_notopic'));
          return;
        }
        var restrictedPlugin = Plugin.getPluginByRestriction(data.topic);
        if (restrictedPlugin) {
          $state.go(restrictedPlugin.route, {
            topic: topic,
            idMessage: idMessage
          }, {
            inherit: false,
            reload: reload
          });
          return;
        }
        if ($localStorage && $localStorage.views && $localStorage.views[topic]) {
          if (!Plugin.getPluginByRoute($localStorage.views[topic])) {
            $localStorage.views[topic] = Plugin.getDefaultPlugin(data.topic).route;
          }
          $state.go($localStorage.views[topic], {
            topic: topic,
            idMessage: idMessage
          }, {
            inherit: false,
            reload: reload
          });
        } else {
          $state.go(Plugin.getDefaultPlugin(data.topic).route, {
            topic: topic,
            idMessage: idMessage
          }, {
            inherit: false,
            reload: reload
          });
        }
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    });

    $scope.$on('loading', function(e, status) {
      self.loading = status;
    });

});
