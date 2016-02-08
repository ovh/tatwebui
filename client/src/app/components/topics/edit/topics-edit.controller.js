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
  .controller('TopicsEditCtrl', function($scope, $stateParams, Authentication,
    TatEngineUsersRsc, TatEngineGroupsRsc, TatEngineTopicsRsc,
    TatEngineTopicRsc, TatEngine, Plugin) {
    'use strict';

    $scope.topic = {};
    $scope.user = {};
    $scope.group = {};

    $scope.data = {
      isAdminOnTopic: false,
      viewsPlugins: Plugin.getPluginsMessagesViews()
    };

    var _self = this;

    /**
     * @ngdoc function
     * @name init
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @description Initialize edit topic page
     *
     */
    this.init = function() {
      TatEngineTopicsRsc.list({
        topic: $stateParams.topicRoute
      }).$promise.then(function(data) {
        if (data.count === 1) {
          $scope.topic = data.topics[0];
          if ($scope.isAdmin() || _.contains($scope.topic.adminUsers,
              Authentication.getIdentity().username) ||
              ($scope.topic.topic.indexOf("/Private/" + Authentication.getIdentity().username) === 0 &&
              $scope.topic.topic.indexOf("/Private/" + Authentication.getIdentity().username + "/DM") !== 0)
            ) {
            // FIXME check group of user. _.contains($scope.topic.adminGroups, Authentication.getIdentity().groups)
            $scope.data.isAdminOnTopic = true;
          }
          _self.checkParametersView();
        }
      }, function(err) {
        TatEngine.displayReturn(err);
      });

      TatEngineUsersRsc.list().$promise.then(function(data) {
        $scope.users = data.users;
      }, function(err) {
        TatEngine.displayReturn(err);
      });

      TatEngineGroupsRsc.list().$promise.then(function(data) {
        $scope.groups = data.groups;
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
    this.initRequestGroup = function(groupname, recursive) {
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
    $scope.addRoUser = function(recursive) {
      TatEngineTopicRsc.addRoUser(_self.initRequestUser($scope.user.selected
        .username, recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.removeRoUser = function(username, recursive) {
      TatEngineTopicRsc.removeRoUser(_self.initRequestUser(username,
        recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.addRwUser = function(recursive) {
      TatEngineTopicRsc.addRwUser(_self.initRequestUser($scope.user.selected
        .username, recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.removeRwUser = function(username, recursive) {
      TatEngineTopicRsc.removeRwUser(_self.initRequestUser(username,
        recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.addAdminUser = function(recursive) {
      TatEngineTopicRsc.addAdminUser(_self.initRequestUser($scope.user.selected
        .username, recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.removeAdminUser = function(username, recursive) {
      TatEngineTopicRsc.removeAdminUser(_self.initRequestUser(username,
        recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.addRoGroup = function(recursive) {
      TatEngineTopicRsc.addRoGroup(_self.initRequestGroup($scope.group.selected
        .name, recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.removeRoGroup = function(groupname, recursive) {
      TatEngineTopicRsc.removeRoGroup(_self.initRequestGroup(groupname,
        recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.addRwGroup = function(recursive) {
      TatEngineTopicRsc.addRwGroup(_self.initRequestGroup($scope.group.selected
        .name, recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.removeRwGroup = function(groupname, recursive) {
      TatEngineTopicRsc.removeRwGroup(_self.initRequestGroup(groupname,
        recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.addAdminGroup = function(recursive) {
      TatEngineTopicRsc.addAdminGroup(_self.initRequestGroup($scope.group.selected
        .name, recursive)).$promise.then(function(data) {
        _self.init();
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
    $scope.removeAdminGroup = function(groupname, recursive) {
      TatEngineTopicRsc.removeAdminGroup(_self.initRequestGroup(groupname,
        recursive)).$promise.then(function(data) {
        _self.init();
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name updateParam
     * @methodOf TatUi.controller:TopicsEditCtrl
     * @param {bool} recursive If true, apply action on all sub-topic
     * @description Update Topic Parameters : maxlength, candForceDate, canUpdateMsg, canDeleteMsg, canUpdateAllMsg, canDeleteAllMsg, isROPublic, isAutoComputeTags, isAutoComputeLabels
     */
    $scope.updateParam = function(recursive) {
      TatEngineTopicRsc.updateParam({
        "topic": $scope.topic.topic,
        "recursive": recursive,
        "maxlength": $scope.topic.maxlength,
        "canForceDate": $scope.topic.canForceDate,
        "canUpdateMsg": $scope.topic.canUpdateMsg,
        "canDeleteMsg": $scope.topic.canDeleteMsg,
        "canUpdateAllMsg": $scope.topic.canUpdateAllMsg,
        "canDeleteAllMsg": $scope.topic.canDeleteAllMsg,
        "isAutoComputeTags": $scope.topic.isAutoComputeTags,
        "isAutoComputeLabels": $scope.topic.isAutoComputeLabels,
        "isROPublic": $scope.topic.isROPublic,
        "parameters": $scope.topic.parameters
      }).$promise.then(function(data) {
        _self.init();
        TatEngine.displayReturn(data);
      }, function(err) {
        console.log(err);
      });
    };

    $scope.newParameter = function() {
      $scope.topic.parameters.push({
        key: 'key',
        value: 'value'
      });
    };

    $scope.removeParameter = function(parameter) {
      _.pull($scope.topic.parameters, parameter);
    };

    $scope.cancelDeleteParameter = function(parameter) {
      delete parameter.deleting;
    };

    this.init();
  });
