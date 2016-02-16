/*global angular,_ */
angular.module('TatUi')
  .controller('TopicCtrl', function TopicCtrl($scope, $rootScope, $interval,
    TatEngineTopicsRsc, TatEngine) {
    'use strict';

    var self = this;

    this.data = {
      requestFrequency: 15000,
      inRefresh: false,
      isFirstCall: true
    };

    this.menuState = [];
    this.topics = {};
    this.treeTopics = [];

    var getSub = function(root, topicName) {
      for (var i = 0; i < root.children.length; i++) {
        if (root.children[i].name === topicName) {
          return root.children[i];
        }
      }
    };

    var addSubTopic = function(root, topics, meta, level) {
      var topicList = '[object Array]' === Object.prototype.toString.call(topics) ? topics : topics.replace(/^\//, '').split('/');
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
        addSubTopic(children, next, meta, level + 1);
      } else {
        children.metadata = meta;
      }
    };

    this.addUnRead = function(topic, listUnread) {
      if (listUnread !== undefined && listUnread !== null && listUnread[topic.topic] !== undefined) {
        topic.unRead = listUnread[topic.topic];
      }
    };

    this.refresh = function() {
      if (!self.data.inRefresh) {
        self.data.inRefresh = true;
        TatEngineTopicsRsc.list({
          'getNbMsgUnread': !self.data.isFirstCall
        }).$promise.then(function(data) {
          self.data.inRefresh = false;
          self.data.isFirstCall = false;
          var tree = {
            fullname: '',
            name: '',
            children: []
          };
          for (var i = 0; i < data.topics.length; i++) {
            self.addUnRead(data.topics[i], data.topicsMsgUnread);
            self.topics[data.topics[i].topic.replace(/^\//, '')] = data.topics[i];
            if ((self.currentTopic) && (self.topics[self.currentTopic])) {
              self.topics[self.currentTopic].active = true;
            }
            addSubTopic(tree, data.topics[i].topic, data.topics[i], 0);
          }
          self.treeTopics = tree.children;
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
        self.changeTopicsVisibility(self.treeTopics, topicArray, true);
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
            self.changeTopicsVisibility(self.treeTopics, topicArray, false);
            self.menuState.splice(i, 1);
            i--;
          }
        }
      }
      self.refreshMenu();
    };

    this.changeTopicsVisibility = function(tree, expansion, visible) {
      var topic = tree;
      if (('[object Array]' === Object.prototype.toString.call(tree)) && (
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
      console.log("init on topic controller");
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
