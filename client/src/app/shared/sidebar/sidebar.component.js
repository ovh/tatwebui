/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.shared:sidebar
 * @description
 * Sidebar
 */
angular.module("TatUi").component("sidebar", {
  controllerAs: "ctrl",
  controller: function(
    $scope,
    $state,
    $translate,
    $cookieStore,
    $rootScope,
    $localStorage,
    $interval,
    appConfiguration,
    TatEngine,
    TatEngineTopicsRsc,
    TatEngineUserRsc,
    TatEnginePresencesRsc,
    AuthenticationRsc,
    Authentication,
    Linker,
    Plugin
  ) {
    "use strict";
    var self = this;

    this.data = {
      mobileView: 992,
      requestFrequency: 50000, // 50s
      isFirstCall: true,
      mode: "all",
      isSearch: false,
      loading: true,
      showSidebar: true,
      isPresencesOpen: false,
      isSettingsOpen: false,
      displayLogout: true,
      bottomMenu: [],
      username: Authentication.getIdentity().username,
      currentTopicName : "",
      filtertopic: "",
      favorites: {},
      presences: {},
      previousMode: "",
      treeTopics: {
        "internal": {
            title: "/Internal",
            topics : [],
            expand: true
        },
        "private": {
            title: "/Private",
            topics : [],
            expand: true
        },
        "privateDm": {
            title: "/DM",
            topics : [],
            expand: true
        },
        "privateOthers": {
            title: "/Others Users",
            topics : [],
            expand: true
        },
      }
    };

    $scope.$on("sidebar-toggle", function(e, meta) {
        self.toggleSidebar();
    });

    self.getUser = function(field) {
      var identity = Authentication.getIdentity();
      return identity[field] ? identity[field] : '';
    };

    self.toggleSidebar = function() {
      self.data.showSidebar = !self.data.showSidebar;
      $cookieStore.put("showSidebar", self.data.showSidebar);
      $rootScope.$broadcast("showSidebar", self.data.showSidebar);
    };

    $scope.$on("topic-change", function(e, meta) {
      console.log("on topic-change, with meta:", meta);
      self.data.currentTopicName = meta.topic;
    });

    $scope.$on("sidebar-reload", function(e, meta) {
      console.log("on sidebar-reload with meta:", meta);
      self.stopTimer();
      self.init();
    });

    self.getWidth = function() {
      return window.innerWidth;
    };

    window.onresize = function() {
      $scope.$apply();
    };

    self.init = function() {
      self.data.loading = true;

      self.data.bottomMenu = [];
      if (appConfiguration.links && appConfiguration.links.menu) {
        self.data.bottomMenu = appConfiguration.links.menu;
      }

      if (appConfiguration.backend && appConfiguration.backend.autologin === true) {
        self.data.displayLogout = false;
      }

      if (angular.isDefined($cookieStore.get("showSidebar"))) {
        self.data.showSidebar = $cookieStore.get("showSidebar");
      } else {
        self.data.showSidebar = true;
      }

      self.data.favorites = {};
      AuthenticationRsc.getInfo({}).$promise.then(function(data) {
        if (data.user.favoritesTopics) {
          for (var i = 0; i < data.user.favoritesTopics.length; i++) {
            self.data.favorites[data.user.favoritesTopics[i]] = true;
          }
        }
        if ($localStorage.sidebarMode && $localStorage.sidebarMode !== "") {
          self.setMode($localStorage.sidebarMode);
        } else {
          self.getTopicList();
        }
        self.beginTimer();
      }, function(err) {
        console.log("err:",err);
      });
    };

    self.setMode = function(mode) {
      if (mode !== "history" && mode !== "all" && mode != "unread" && mode !== "favorites") {
        mode = "all";
      }
      self.data.mode = mode;
      this.data.isSettingsOpen = false;
      $localStorage.sidebarMode = self.data.mode;
      self.data.loading = true;

      if (mode == "history") {
        self.getHistory();
      } else {
        self.getTopicList();
      }
    };

    self.getHistory = function() {
      TatEnginePresencesRsc.list({
        limit: 20
      }).$promise.then(function(data) {
        if (data.presences) {
          for (var i = 0; i < data.presences.length; i++) {
            self.data.presences[data.presences[i].topic] = data.presences[i];
          }
        }
        self.getTopicList();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    $scope.$on("sidebar-change", function(event, topicName) {
      self.data.currentTopicName = topicName;
    });

    self.selectTopic = function(topicName) {
      self.data.currentTopicName = topicName;
    };

    self.getTopicList = function() {
      TatEngineTopicsRsc.list({
        getNbMsgUnread: !self.data.isFirstCall,
        onlyFavorites: self.data.mode === "favorites"
      }).$promise.then(function(data) {
        var ttopics = {};
        for (var typeTopic in self.data.treeTopics) {
          self.data.treeTopics[typeTopic].topics = [];
        }
        for (var i = 0; i < data.topics.length; i++) {
          var topicType = self.computeTypeTopic(data.topics[i]);
          data.topics[i].topicType = topicType;

          if (topicType != "toSkip") {
            if (!self.data.treeTopics[topicType]) {
              self.data.treeTopics[topicType] = {
                  title: topicType,
                  topics : [],
                  expand: true
              };
            }
            if (data.topicsMsgUnread && data.topicsMsgUnread[data.topics[i].topic]) {
              data.topics[i].unread = data.topicsMsgUnread[data.topics[i].topic];
            }
            if (self.data.mode === "unread") {
              if (data.topics[i].unread && data.topics[i].unread > 0) {
                  self.data.treeTopics[topicType].topics.push(data.topics[i]);
              }
            } else if (self.data.mode === "history") {
              ttopics[data.topics[i].topic] = data.topics[i];
            } else {
              self.data.treeTopics[topicType].topics.push(data.topics[i]);
            }
          }
        }

        if (self.data.mode === "history") {
          for (var p in self.data.presences) {
            var t = ttopics[self.data.presences[p].topic];
            if (t && t.topicType) { // check if not skipped
              self.data.treeTopics[t.topicType].topics.push(t);
            }
          }
        }
        self.data.loading = false;
      }, function(err) {
        TatEngine.displayReturn(err);
      });
      self.data.isFirstCall = false;
    };

    this.computeTypeTopic = function(topic) {
      if (topic.topic.indexOf("/Internal") === 0) {
        topic.nameDisplayed = topic.topic.substr("/Internal/".length);
        if (topic.nameDisplayed === "") {
          return "toSkip"; // "/Internal";
        }
        return "internal";
      } else if (topic.topic.indexOf("/Private/" + self.data.username + "/DM/") === 0) {
        topic.nameDisplayed = topic.topic.substr(("/Private/" + self.data.username + "/DM/").length);
        if (topic.nameDisplayed === "") {
          return "toSkip";
        }
        return "privateDm";
      } else if (topic.topic === "/Private/" + self.data.username + "/DM") {
        return "toSkip";
      } else if (topic.topic.indexOf("/Private/" + self.data.username) === 0) {
        topic.nameDisplayed = topic.topic.substr(("/Private/" + self.data.username+"/").length);
        if (topic.nameDisplayed === "") {
          topic.nameDisplayed = self.data.username;
        }
        return "private";
      } else if (topic.topic.indexOf("/Private/") === 0) {
        topic.nameDisplayed = topic.topic.substr("/Private/".length);
        if (topic.nameDisplayed === "") {
          return "toSkip";
        }
        return "privateOthers";
      } else {
        var idx = topic.topic.indexOf("/", 2);
        if (idx == -1) { // root topic
          return "toSkip";
        }
        topic.nameDisplayed = topic.topic.substr(idx+1);
        return topic.topic.substr(0, idx);
      }
    };

    self.searchEnter = function() {
      angular.element("#searchbox").focus();
    };

    self.searchKey = function(keyCode) {
      if (!self.data.isSearch) {
        self.data.previousMode = self.data.mode;
        if (self.data.previousMode !== "all") {
          self.setMode("all");
        }
        self.data.isSearch = true;
      } else if (self.data.filtertopic === ""){
        self.searchExit();
      }
    };

    $scope.$on("presences-refresh", function(e) {
      self.loadPresences();
    });

    $scope.$on("presences-toggle", function(e) {
      self.togglePresences();
    });

    this.togglePresences = function() {
      this.data.isPresencesOpen = !this.data.isPresencesOpen;
      if (this.data.isPresencesOpen) {
        this.data.isSettingsOpen = false;
      }
      self.loadPresences(); // load here, and in topics list refresh
    };

    this.toggleSettings = function() {
      this.data.isSettingsOpen = !this.data.isSettingsOpen;
      this.data.mode = "settings";
      if (this.data.isSettingsOpen) {
        this.data.isPresencesOpen = false;
      }
    };

    this.loadPresences = function() {
      // Load/display presences *after* messages
      if (!self.data.currentTopicName || self.data.currentTopicName === "") {
        return;
      }
      TatEnginePresencesRsc.list({
        topic: self.data.currentTopicName.substring(1), // remove first /
        dateMinPresence: (Math.floor(Date.now() /1000) - 30), // last 30s
        limit: 200
      }).$promise.then(function(data) {
        if (self.data.presences) {
          data.presences.sort(function(a, b) {
            if (a.userPresence.fullname.toLocaleLowerCase() < b.userPresence.fullname.toLocaleLowerCase()) return -1;
            else if (a.userPresence.fullname.toLocaleLowerCase() > b.userPresence.fullname.toLocaleLowerCase()) return 1;
            else return 0;
          });
          self.data.presences = data.presences;
        }
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    this.computeURL = function(topic) {
      return Linker.computeURL(topic);
    };

    self.computeURLDM = function(toUsername) {
      return Linker.computeURLDM(toUsername);
    };

    self.searchExit = function() {
      self.data.isSearch = false;
      if (self.data.previousMode === "" || self.data.previousMode === "all") {
        return;
      }
      if (self.data.filtertopic === "") {
        self.setMode(self.data.previousMode);
        return;
      }
    };

    self.beginTimer = function() {
      if ("undefined" === typeof self.data.timer) {
        self.data.timer = $interval(self.getTopicList, self.data.requestFrequency);
        $scope.$on("$destroy", function() { self.stopTimer(); });
      }
    };

    self.stopTimer = function() {
      $interval.cancel(self.data.timer);
      self.data.timer = undefined;
    };

    self.init();
  },
  templateUrl: "app/shared/sidebar/sidebar.component.html"
});
