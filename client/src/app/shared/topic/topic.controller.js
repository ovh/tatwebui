/*global angular,_ */
angular.module('TatUi')
  .controller('TopicCtrl', function TopicCtrl(
    $scope,
    $rootScope,
    $interval,
    TatEngineTopicsRsc,
    Authentication,
    TatEngine) {
    'use strict';

    var self = this;

    this.data = {
      requestFrequency: 15000,
      inRefresh: false,
      isFirstCall: true
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

      if (!children) {
        children = {
          level: level,
          name: childName,
          fullname: root.fullname + '/' + childName,
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

    this.refresh = function() {
      if (!self.data.inRefresh) {
        self.data.inRefresh = true;
        TatEngineTopicsRsc.list({
          'getNbMsgUnread': !self.data.isFirstCall
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

          self.refreshMenu();
        }, function(err) {
          TatEngine.displayReturn(err);
          self.data.inRefresh = false;
          self.data.isFirstCall = false;
        });
        $rootScope.$broadcast('presences-refresh');
      } else {
        console.log("topics list already in refresh...");
      }
    };

    $scope.$on('menu-expand', function(event, data) {
      var topicName = data.join("/");
      self.changeMenuState(topicName);
    });

    $scope.$on('sidebar-change', function(event, data) {
      if (data.topic !== undefined) {
        self.changeMenuState(data.topic);
      }
    });

    this.refreshMenu = function() {
      for (var i = 0; i < self.menuState.length; i++) {
        // remove first /
        var topicArray = self.menuState[i].split('/');
        if (topicArray[0] === '') {
          topicArray.splice(0, 1);
        }
        self.changeTopicsVisibility(self.treeTopics.internal, topicArray, true);
        self.changeTopicsVisibility(self.treeTopics.private, topicArray, true);
        self.changeTopicsVisibility(self.treeTopics.privateDm, topicArray, true);
        self.changeTopicsVisibility(self.treeTopics.privateOthers, topicArray, true);
      }
    };

    this.changeMenuState = function(topic) {
      if (topic !== undefined && topic.visible) {
        // add in menu state
        if (!self.menuState[topic.fullname]) {
          self.menuState.push(topic.fullname);
        }
      } else if (topic !== undefined) {
        for (var i = 0; i < self.menuState.length; i++) {
          if (self.menuState[i].indexOf(topic.fullname) === 0) {
            var topicArray = self.menuState[i].split('/');
            if (topicArray[0] === '') {
              topicArray.splice(0, 1);
            }
            self.changeTopicsVisibility(self.treeTopics.internal, topicArray, false);
            self.changeTopicsVisibility(self.treeTopics.private, topicArray, false);
            self.changeTopicsVisibility(self.treeTopics.privateDm, topicArray, false);
            self.changeTopicsVisibility(self.treeTopics.privateOthers, topicArray, false);
            self.menuState.splice(i, 1);
            i--;
          }
        }
      }
      self.refreshMenu();
    };

    this.changeTopicsVisibility = function(treeTopics, expansion, visible) {
      var topic = treeTopics;
      if (('[object Array]' === Object.prototype.toString.call(treeTopics)) && (
          '[object Array]' === Object.prototype.toString.call(expansion))) {
        for (var i = 0; i < expansion.length; i++) {
          topic = _.find(topic, {name: expansion[i]});
          if (topic) {
            topic.visible = visible;
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

    this.init = function() {
      self.refresh();
      $scope.$on('topic', function(event, data) {
        self.currentTopic = data;
        for (var key in self.topics) {
          if (self.topics.hasOwnProperty(key)) {
            self.topics[key].active = false;
          }
        }
        if (self.topics[data]) {
          self.topics[data].active = true;
        }
      });

      self.beginTimer(self.data.requestFrequency);
    };

    this.init();

  });
