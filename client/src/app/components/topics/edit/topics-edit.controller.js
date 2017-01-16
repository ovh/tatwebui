/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:TopicsEditCtrl
 * @requires TatUi.Authentication
 * @requires TatUi.TatEngineUsersRsc
 * @requires TatUi.TatEngineGroupsRsc
 * @requires TatUi.TatEngineTopicsRsc
 * @requires TatUi.TatEngineTopicRsc
 * @requires TatUi.TatEngine
 * @description Edit Topic controller
 *
 */
angular.module('TatUi')
  .controller('TopicsEditCtrl', function($scope,
    $stateParams,
    appConfiguration,
    Authentication,
    TatEngineUsersRsc,
    TatEngineGroupsRsc,
    TatEngineTopicsRsc,
    TatEngineTopicRsc,
    TatEngine,
    TatTopic,
    Linker,
    Plugin
  ) {
    'use strict';

    var self = this;

    self.data = {
      viewsPlugins: Plugin.getPluginsMessagesViews(),
      topic: {},
      user: {},
      group: {}
    };

    /**
     * @ngdoc function
     * @name init
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @description Initialize edit topic page
     *
     */
    this.init = function() {

      TatTopic.computeTopic($stateParams.topicRoute.substring(1), function(topic) {
        $scope.topic = topic;
        $scope.topic.url = Linker.computeURL(topic);
        self.checkParametersView();
        self.data = angular.extend(self.data, TatTopic.getDataTopic());
      });

      TatEngineUsersRsc.list().$promise.then(function(data) {
        self.data.users = data.users;
      }, function(err) {
        TatEngine.displayReturn(err);
      });

      TatEngineGroupsRsc.list().$promise.then(function(data) {
        self.data.groups = data.groups;
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name checkParametersView
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @description add defaultview and restrictedview parameters
     *
     */
    this.checkParametersView = function() {
      var hasDefaultView = false;
      var hasRestrictedView = false;

      if (!$scope.topic.parameters) {
        $scope.topic.parameters = [];
      }

      for (var i = 0; i < $scope.topic.parameters.length; i++) {
        if ($scope.topic.parameters[i].key === "tatwebui.view.default") {
          hasDefaultView = true;
        } else if ($scope.topic.parameters[i].key ===
          "tatwebui.view.restricted") {
          hasRestrictedView = true;
        }
      }
      if (!hasDefaultView) {
        $scope.topic.parameters.push({
          key: 'tatwebui.view.default',
          value: ''
        });
      }
      if (!hasRestrictedView) {
        $scope.topic.parameters.push({
          key: 'tatwebui.view.restricted',
          value: ''
        });
      }
    };

    /**
     * @ngdoc function
     * @name initRequestUser
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {string} username  Username of selected user
     * @param {bool}   recursive If true, apply action on all sub-topic
     * @description initialize body of request with topic & username
     *
     */
    this.initRequestUser = function(username, recursive) {
      return {
        'topic': $scope.topic.topic,
        'username': username,
        'recursive': recursive
      };
    };

    /**
     * @ngdoc function
     * @name initRequestGroup
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {string} groupname Name of selected group
     * @param {bool}   recursive If true, apply action on all sub-topic
     * @description initialize body of request with topic & groupname
     */
    self.initRequestGroup = function(groupname, recursive) {
      return {
        'topic': $scope.topic.topic,
        'groupname': groupname,
        'recursive': recursive
      };
    };

    /**
     * @ngdoc function
     * @name addRoUser
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {bool} recursive If true, apply action on all sub-topic
     * @description Add a read only user on topic
     */
    self.addRoUser = function(recursive) {
      console.log("addRoUser enter");
      TatEngineTopicRsc.addRoUser(self.initRequestUser(self.data.user.selected
        .username, recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name removeRoUser
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {string} username  Username of selected user
     * @param {bool}   recursive true of false. If true, apply action on all sub-topic
     * @description Remove a read only user from topic
     */
    self.removeRoUser = function(username, recursive) {
      TatEngineTopicRsc.removeRoUser(self.initRequestUser(username,recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name addRwUser
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {bool} recursive If true, apply action on all sub-topic
     * @description Add a Read Write user on topic
     */
    self.addRwUser = function(recursive) {
      TatEngineTopicRsc.addRwUser(self.initRequestUser(self.data.user.selected.username, recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name removeRwUser
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {string} username  Username of selected user
     * @param {bool}   recursive If true, apply action on all sub-topic
     * @description Removed a Read Write user on topic
     */
    self.removeRwUser = function(username, recursive) {
      TatEngineTopicRsc.removeRwUser(self.initRequestUser(username, recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name addAdminUser
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {bool} recursive If true, apply action on all sub-topic
     * @description Add an admin user on topic
     */
    self.addAdminUser = function(recursive) {
      TatEngineTopicRsc.addAdminUser(self.initRequestUser(self.data.user.selected.username, recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name removeAdminUser
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {string} username Username of selected user
     * @param {bool}  recursive If true, apply action on all sub-topic
     * @description Remove an admin user from topic
     */
    self.removeAdminUser = function(username, recursive) {
      TatEngineTopicRsc.removeAdminUser(self.initRequestUser(username,recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name addRoGroup
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {bool} recursive If true, apply action on all sub-topic
     * @description Add a Read Only group on topic
     */
    self.addRoGroup = function(recursive) {
      TatEngineTopicRsc.addRoGroup(self.initRequestGroup(self.data.group.selected.name, recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name removeRoGroup
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {string} groupname Name of selected group
     * @param {bool}   recursive If true, apply action on all sub-topic
     * @description Remove a Read Only group from topic
     */
    self.removeRoGroup = function(groupname, recursive) {
      TatEngineTopicRsc.removeRoGroup(self.initRequestGroup(groupname,recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name addRwGroup
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {bool} recursive If true, apply action on all sub-topic
     * @description Add a Read Write group on topic
     */
    self.addRwGroup = function(recursive) {
      TatEngineTopicRsc.addRwGroup(self.initRequestGroup(self.data.group.selected.name, recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name removeRwGroup
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {string} groupname Name of selected group
     * @param {bool}   recursive If true, apply action on all sub-topic
     * @description Remove a Read Write group from topic
     */
    self.removeRwGroup = function(groupname, recursive) {
      TatEngineTopicRsc.removeRwGroup(self.initRequestGroup(groupname,recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name addAdminGroup
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {bool} recursive If true, apply action on all sub-topic
     * @description Add an Admin group on topic
     */
    self.addAdminGroup = function(recursive) {
      TatEngineTopicRsc.addAdminGroup(self.initRequestGroup(self.data.group.selected.name, recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name removeAdminGroup
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {string} groupname Name of selected group
     * @param {bool}   recursive If true, apply action on all sub-topic
     * @description Remove an Admin group from topic
     */
    self.removeAdminGroup = function(groupname, recursive) {
      TatEngineTopicRsc.removeAdminGroup(self.initRequestGroup(groupname, recursive)).$promise.then(function(data) {
        self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name updateParam
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {bool} recursive If true, apply action on all sub-topic
     * @description Update Topic Parameters : maxlength, maxreplies, candForceDate, canUpdateMsg, canDeleteMsg, canUpdateAllMsg, canDeleteAllMsg, isAutoComputeTags, isAutoComputeLabels
     */
    self.updateParam = function(recursive) {
      TatEngineTopicRsc.updateParam({
        "topic": $scope.topic.topic,
        "recursive": recursive,
        "maxlength": $scope.topic.maxlength,
        "maxreplies": $scope.topic.maxreplies,
        "canForceDate": $scope.topic.canForceDate,
        "canUpdateMsg": $scope.topic.canUpdateMsg,
        "canDeleteMsg": $scope.topic.canDeleteMsg,
        "canUpdateAllMsg": $scope.topic.canUpdateAllMsg,
        "canDeleteAllMsg": $scope.topic.canDeleteAllMsg,
        "adminCanUpdateAllMsg": $scope.topic.adminCanUpdateAllMsg,
        "adminCanDeleteAllMsg": $scope.topic.adminCanDeleteAllMsg,
        "isAutoComputeTags": $scope.topic.isAutoComputeTags,
        "isAutoComputeLabels": $scope.topic.isAutoComputeLabels,
        "parameters": $scope.topic.parameters
      }).$promise.then(function(data) {
        self.init();
        TatEngine.displayReturn(data);
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    self.newParameter = function() {
      $scope.topic.parameters.push({
        key: 'key',
        value: 'value'
      });
    };

    self.newParameterXmpp = function(mode) {
      var domain = "domain.net";
      if (appConfiguration && appConfiguration.xmpp && appConfiguration.xmpp.domain !== "") {
        domain = appConfiguration.xmpp.domain;
      }
      $scope.topic.parameters.push({
        key: 'tathook-xmpp'+mode,
        value: 'your-conference@conference.'+domain
      });
    };

    self.removeParameter = function(parameter) {
      _.pull($scope.topic.parameters, parameter);
    };

    self.cancelDeleteParameter = function(parameter) {
      delete parameter.deleting;
    };

    this.init();
  });
