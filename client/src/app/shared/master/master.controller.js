/*global angular */
angular.module('TatUi')
  .controller('MasterCtrl', function MasterCtrl(
    $scope,
    $rootScope,
    Authentication,
    $cookieStore,
    $state,
    appConfiguration,
    TatEngineUserRsc,
    TatEngine,
    TatEngineTopicRsc,
    TatEnginePresencesRsc,
    Flash,
    Plugin,
    $localStorage,
    $stateParams,
    $translate
  ) {
    'use strict';
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    var self = this;

    this.loading = false;
    this.data = {
      isFavoriteTopic: false,
      isNotificationsOffTopic: false,
      isPresencesOpen: false,
      topic: {},
      viewsEnabled: false
    };

    var views = [];

    var viewsPlugins = Plugin.getPluginsMessagesViews();
    if (viewsPlugins) {
      for (var i = 0; i < viewsPlugins.length; i++) {
        views.push(viewsPlugins[i]);
      }
    }

    $scope.topicClick = function(topic) {
      $rootScope.$broadcast('topic-change', {
        topic: topic
      });
      $rootScope.$broadcast('sidebar-change', {topic:topic});
    };

    $scope.canEditTopic = function(topic) {
      if (!topic.topic) {
        return;
      }
      if ($scope.isAdmin() || _.contains(topic.adminUsers,
          Authentication.getIdentity().username) ||
          (topic.topic.indexOf("/Private/" + Authentication.getIdentity().username) === 0 &&
           topic.topic.indexOf("/Private/" + Authentication.getIdentity().username + "/DM") !== 0
          )
        ) {
        // FIXME check group of user. _.contains($scope.topic.adminGroups, Authentication.getIdentity().groups)
        return true;
      }
      return false;
    };

    $scope.getFavoritesTopics = function() {
      return Authentication.getIdentity().favoritesTopics;
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

    $scope.getWidth = function() {
      return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue) {
      if (newValue >= mobileView) {
        if (angular.isDefined($cookieStore.get('toggle'))) {
          $scope.toggle = !$cookieStore.get('toggle') ? false : true;
        } else {
          $scope.toggle = true;
        }
      } else {
        $scope.toggle = false;
      }

    });

    $scope.directMessage = function(username) {
      var me = Authentication.getIdentity().username;
        $rootScope.$broadcast('topic-change', {
          topic: 'Private/'+ me +'/DM/'+ username
        });
    };

    $scope.toggleSidebar = function() {
      $scope.toggle = !$scope.toggle;
      $cookieStore.put('toggle', $scope.toggle);
    };

    $scope.getViews = function() {
      var restrictedPlugin =
        Plugin.getPluginByRestriction(self.data.topic);
      if (restrictedPlugin) {
        self.data.viewsEnabled = false;
        return null;
      } else {
        self.data.viewsEnabled = true;
        return views;
      }
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

    window.onresize = function() {
      $scope.$apply();
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
          Authentication.refreshIdentity();
        });
      } else {
        TatEngineUserRsc.addFavoriteTopic({
          'topic': '/' + self.topic
        }).$promise.then(function() {
          self.data.isFavoriteTopic = true;
          Authentication.refreshIdentity();
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
      self.loadPresences(); // load here, and in topics list refresh
    };

    this.loadPresences = function() {
      // Load/display presences *after* messages
      if (!self.topic || self.topic === "") {
        return
      }
      TatEnginePresencesRsc.list({
        topic: self.topic,
        dateMinPresence: (Math.floor(Date.now() /1000) - 30), // last 30s
        limit: 500
      }).$promise.then(function(data) {
        $scope.presences = data.presences;
        if (data.presences) {
          $scope.presences.sort(function(a, b) {
            if (a.userPresence.fullname.toLocaleLowerCase() < b.userPresence.fullname.toLocaleLowerCase()) return -1;
            else if (a.userPresence.fullname.toLocaleLowerCase() > b.userPresence.fullname.toLocaleLowerCase()) return 1;
            else return 0;
          });
        }
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    $rootScope.$on('$stateChangeSuccess',
      function(e, toState, params) {
        $scope.path = toState.name.split('-');
        self.data.state = toState.name;

        if (self.isPluginViewRoute(toState.name)) {
          $rootScope.$broadcast('topic', params.topic);
          self.topic = params.topic;

          TatEngineTopicRsc.oneTopic({
            action: self.topic
          }).$promise.then(function(data) {
            if (!data.topic) {
              Flash.create('danger',
                $translate.instant('topics_notopic'));
              return;
            }
            self.data.topic = data.topic;

            $scope.title = params.topic.split('/');
            self.data.favoriteTopics = Authentication.getIdentity().favoritesTopics;
            self.data.offNotificationsTopics = Authentication.getIdentity()
              .offNotificationsTopics;
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

            var restrictedPlugin =
              Plugin.getPluginByRestriction(self.data.topic);
            if (restrictedPlugin && restrictedPlugin.route != toState.name) {
              $state.go(restrictedPlugin.route, {
                topic: params.topic
              }, {
                inherit: false,
                reload: false
              });
              return;
            }

          }, function(err) {
            TatEngine.displayReturn(err);
          });
        } else {
          $scope.title = toState.name;
        }
      }
    );

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
          Flash.create('danger',
            $translate.instant('topics_notopic'));
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
        if ($localStorage && $localStorage.views && $localStorage.views[
            topic]) {
          if (!Plugin.getPluginByRoute($localStorage.views[topic])) {
            $localStorage.views[topic] =
              Plugin.getDefaultPlugin(data.topic).route;
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

    $scope.$on('presences-refresh', function(e) {
      self.loadPresences();
    });

  });
