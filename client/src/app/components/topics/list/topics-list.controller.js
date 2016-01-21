/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:TopicsListCtrl
 * @requires TatUi.TatEngineTopicsRsc Tat Engine Topics Resource
 * @requires TatUi.TatEngine          Tat Engine Provider
 * @description Topics List Controller
 */
angular.module('TatUi')
  .controller('TopicsListCtrl', function($scope, TatEngineTopicsRsc, TatEngine, Authentication) {
    'use strict';

    $scope.data = {
      filtertopic: "",
      getForTatAdmin: false,
      adminOfOneTopic: false,
      filterList: ""
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
        "getForTatAdmin": $scope.data.getForTatAdmin
      };
      TatEngineTopicsRsc.list(criteria).$promise.then(function(data) {
        for (var i = 0; i < data.topics.length; i++) {
          if (data.topics[i].adminUsers || data.topics[i].adminGroups) {
            $scope.data.adminOfOneTopic = true;
            break;
          }
        }
        $scope.data.topics = data.topics;
        $scope.data.count = data.count;
      }, function(err) {
        TatEngine.displayReturn(err);
      });
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
