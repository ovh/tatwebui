/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:TopicsNewCtrl
 * @requires $stateParams
 * @requires $state
 * @requires TatUi.TatEngineTopicRsc Tat Engine Topic Resource
 * @requires TatUi.TatEngine         Tat Engine Provider
 * @description Controller of Create a new Topic page
 */
angular.module('TatUi')
    .controller('TopicsNewCtrl', function($scope, $stateParams, $state, TatEngineTopicRsc, TatEngine) {
    'use strict';

    $scope.topic = {
      'topic': '',
      'description': ''
    };

    /**
     * @ngdoc function
     * @name createTopic
     * @methodOf TatUi.controller:TopicsNewCtrl
     * @description Creates a new topic with a description
     */
    $scope.createTopic = function() {
      TatEngineTopicRsc.create(
        { 'topic' : $scope.topic.topic, 'description' : $scope.topic.description }
      ).$promise.then(function(data){
        $state.go('topics-edit', {topicId: data._id});
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

});
