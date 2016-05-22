/*global angular,_ */
angular.module('TatUi')
  .controller('TopicCtrl', function TopicCtrl(
    $scope,
    $rootScope,
    $interval,
    $localStorage,
    TatEngineTopicsRsc,
    Authentication,
    TatEngine) {
    'use strict';

    var self = this;

    this.data = {
      requestFrequency: 15000,
      inRefresh: false,
      isFirstCall: true,
      onlyFavorites: false,
      isInitializing: false
    };

    this.menuState = [];
    this.topics = {};
    this.treeTopics = {
      "internal": [],
      "private": [],
      "privateDm": [],
      "privateOthers": []
    };

    var getSub = function(root, topicName) {
      for (var i = 0; i < root.children.length; i++) {
        if (root.children[i].name === topicName) {
          return root.children[i];
        }
      }
    };

    this.endsWith = function(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    var addSubTopic = function(topicType, root, topicName, meta, level) {
      var topicList = [];
      if (topicType == "privateDm" || topicType == "privateOthers") {
        if ('[object Array]' !== Object.prototype.toString.call(topicName)) {
            topicName = self.getNameDM(topicName);
        }
      } else if (topicType == "private") {
        if ('[object Array]' !== Object.prototype.toString.call(topicName)) {
            topicName = self.getNamePrivate(topicName);
        }
      }
      topicList = '[object Array]' === Object.prototype.toString.call(topicName) ? topicName : topicName.replace(/^\//, '').split('/');

      var childName = topicList[0];
      var children = getSub(root, childName);
      var fulltopicname = meta.topic;
      if (!self.endsWith(meta.topic, root.fullname+'/'+childName)) {
        fulltopicname = root.fullname + '/' + childName;
      }
      if (!children) {
        children = {
          level: level,
          name: childName,
          fullname: root.fullname + '/' + childName,
          topic: fulltopicname,
          children: [],
          visible: false,
          isExpanded: function() {
            if (children.children.length) {
              return children.visible;
            }
          }
        };
        root.children.push(children);
      }
      var next = topicList.slice(1);
      if (next.length) {
        addSubTopic(topicType, children, next, meta, level + 1);
      } else {
        children.metadata = meta;
      }
    };

    this.getNamePrivate = function(topicName) {
      return topicName.replace("/Private/", "");
    };

    this.getNameDM = function(topicName) {
      return topicName.replace("/Private/" + Authentication.getIdentity().username + "/", "");
    };

    this.addUnRead = function(topic, listUnread) {
      if (listUnread !== undefined && listUnread !== null && listUnread[topic.topic] !== undefined) {
        topic.unRead = listUnread[topic.topic];
      }
    };

    this.computeTypeTopic = function(topicName) {
      if (topicName.indexOf("/Internal") === 0) {
        return "internal";
      } else if (topicName.indexOf("/Private/" + Authentication.getIdentity().username+"/DM/") === 0) {
        return "privateDm";
      } else if (topicName === "/Private/" + Authentication.getIdentity().username+"/DM") {
        return "toSkip";
      } else if (topicName.indexOf("/Private/" + Authentication.getIdentity().username) === 0) {
        return "private";
      } else if (topicName.indexOf("/Private/") === 0) {
        return "privateOthers";
      }
    };

    this.initTreeVar = function() {
      return {
        fullname: '',
        name: '',
        children: []
      };
    };

    this.refresh = function(cb) {
      // check if refresh identity was done
      if (Authentication.getIdentity().favoritesTopics) {
        self.nextRefresh(cb);
      } else {
        Authentication.refreshIdentity().then(
          function(data) {
            self.nextRefresh(cb);
          },
          function(err) {
            console.log("error while refreshing identity in topic controller:",err);
          });
      }
    };

    this.nextRefresh = function(cb) {
      if ($localStorage.tatMenuDisplayFavorites) {
        self.data.onlyFavorites = $localStorage.tatMenuDisplayFavorites;
      } else {
        $localStorage.tatMenuDisplayFavorites = false;
      }

      if (self.data.isFirstCall === true) {
          self.data.isInitializing = true;
      }

      if (!self.data.inRefresh) {
        self.data.inRefresh = true;
        TatEngineTopicsRsc.list({
          'getNbMsgUnread': !self.data.isFirstCall,
          'onlyFavorites': self.data.onlyFavorites
        }).$promise.then(function(data) {
          self.data.inRefresh = false;
          self.data.isFirstCall = false;

          var tree = {};
          tree.internal = self.initTreeVar();
          tree.private = self.initTreeVar();
          tree.privateOthers = self.initTreeVar();
          tree.privateDm = self.initTreeVar();

          for (var i = 0; i < data.topics.length; i++) {
            var topicType = self.computeTypeTopic(data.topics[i].topic);
            if (topicType == "toSkip") {
              continue;
            }
            self.addUnRead(data.topics[i], data.topicsMsgUnread);
            self.topics[data.topics[i].topic.replace(/^\//, '')] = data.topics[i];
            if ((self.currentTopic) && (self.topics[self.currentTopic])) {
              self.topics[self.currentTopic].active = true;
            }
            addSubTopic(topicType, tree[topicType], data.topics[i].topic, data.topics[i], 0);
          }

          self.treeTopics.internal = tree.internal.children;
          self.treeTopics.private = tree.private.children;
          self.treeTopics.privateDm = tree.privateDm.children;
          self.treeTopics.privateOthers = tree.privateOthers.children;
          self.data.isInitializing = false;
          self.refreshMenu();
          try { cb(); } catch(e){}
        }, function(err) {
          TatEngine.displayReturn(err);
          self.data.inRefresh = false;
          self.data.isFirstCall = false;
        });
        $rootScope.$broadcast('presences-refresh');
      } else {
        console.log("topics list already in refresh...");
        try { cb(); } catch(e){}
      }
    };

    $scope.$on('topicChangeRoute', function(event, data) {
      self.refresh(function() {
        self.currentTopic = data;
        for (var key in self.topics) {
          if (self.topics.hasOwnProperty(key)) {
            self.topics[key].active = false;
          }
        }
        if (self.topics[data]) {
          self.topics[data].active = true;
          self.topics[data].visible = true;
          self.changeMenuState(self.topics[data]);
        }
        self.beginTimer(self.data.requestFrequency);
      });
    });

    $scope.$on('sidebar-change', function(event, data) {
      if (data.topic !== undefined) {
        if (data.topic.visible === undefined && typeof data.topic !== 'string') {
          data.topic.visible = true;
        }
        if ('/' + self.currentTopic == data.topic.topic) {
          data.topic.visible = !data.topic.visible;
        }
        self.changeMenuState(data.topic);
      }
    });

    this.isFavoriteTopic = function(topic) {
      var favoritesTopics = Authentication.getIdentity().favoritesTopics;
      for (var i = 0; i < favoritesTopics.length; i++) {
        if (favoritesTopics[i] === topic.topic) {
          return true;
        }
      }
      return false;
    };

    this.refreshMenu = function() {
      for (var i = 0; i < self.menuState.length; i++) {
        // remove first /
        var topicArray = self.menuState[i].split('/');
        if (topicArray[0] === '') {
          topicArray.splice(0, 1);
        }
        self.changeTopicsVisibility(self.treeTopics.internal, topicArray, true, "internal");
        self.changeTopicsVisibility(self.treeTopics.private, topicArray, true, "private");
        self.changeTopicsVisibility(self.treeTopics.privateDm, topicArray, true, "privateDm");
        self.changeTopicsVisibility(self.treeTopics.privateOthers, topicArray, true, "privateOthers");
      }
    };

    this.changeMenuState = function(topic) {
      var topicArray = [];
      if (topic !== undefined && topic.visible) {
        // add in menu state
        if (_.indexOf(self.menuState, topic.topic) == -1) {
          self.menuState.push(topic.topic);
        }
        topicArray = topic.topic.split('/');
        if (topicArray[0] === '') {
          topicArray.splice(0, 1);
        }
        self.changeTopicsVisibility(self.treeTopics.internal, topicArray, true, "internal");
        self.changeTopicsVisibility(self.treeTopics.private, topicArray, true, "private");
        self.changeTopicsVisibility(self.treeTopics.privateDm, topicArray, true, "privateDm");
        self.changeTopicsVisibility(self.treeTopics.privateOthers, topicArray, true, "privateOthers");
      } else if (topic !== undefined) {
        for (var i = 0; i < self.menuState.length; i++) {
          if (self.menuState[i].indexOf(topic.topic) === 0) {
            topicArray = self.menuState[i].split('/');
            if (topicArray[0] === '') {
              topicArray.splice(0, 1);
            }
            self.changeTopicsVisibility(self.treeTopics.internal, topicArray, false, "internal");
            self.changeTopicsVisibility(self.treeTopics.private, topicArray, false, "private");
            self.changeTopicsVisibility(self.treeTopics.privateDm, topicArray, false, "privateDm");
            self.changeTopicsVisibility(self.treeTopics.privateOthers, topicArray, false, "privateOthers");
            self.menuState.splice(i, 1);
            i--;
          }
        }
      }
    };

    this.changeTopicsVisibility = function(treeTopics, expansion, visible, typeTopics) {
      //console.log("changeTopicsVisibility treeTopics:",treeTopics," expansion:",expansion," visible:",visible);
      var topic = treeTopics;
      if (('[object Array]' === Object.prototype.toString.call(treeTopics)) && (
          '[object Array]' === Object.prototype.toString.call(expansion))) {
        var start = 0;
        if (typeTopics == "private" || typeTopics == "privateOthers") {
          start = 1;
        } else if (typeTopics == "privateDm") {
          start = 2;
        }
        for (var i = start; i < expansion.length; i++) {
          topic = _.find(topic, {name: expansion[i]});
          if (topic) {
            if (visible === true || (visible === false && expansion.length == i-1)) {
              // TODO fix Private & DM message visible console.log("set to visible:",visible," for:",topic.topic);
              topic.visible = visible;
            }
            if (topic.children) {
              topic = topic.children;
            }
          }
        }
      }
    };

    this.beginTimer = function(timeInterval) {
      if ('undefined' === typeof self.data.timer) {
        self.data.timer = $interval(self.refresh, timeInterval);
        $scope.$on("$destroy", function() { self.stopTimer(); });
      }
    };

    this.stopTimer = function() {
      $interval.cancel(self.data.timer);
      self.data.timer = undefined;
    };

    this.toggleFavoritesTopics = function() {
      self.data.isInitializing = true;
      self.data.onlyFavorites = !self.data.onlyFavorites;
      $localStorage.tatMenuDisplayFavorites = self.data.onlyFavorites;
      if (self.data.onlyFavorites === true) {
        self.treeTopics.internal = [];
      }
      self.refresh();
    };

  });
