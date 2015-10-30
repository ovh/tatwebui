/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:GroupsEditCtrl
 * @requires $stateParams
 * @requires Authentication
 * @requires TatUi.TatEngineUsersRsc Users resource of Tat Engine
 * @requires TatUi.TatEngineGroupsRsc Groups resource of Tat Engine
 * @requires TatUi.TatEngineGroupRsc Group resource of Tat Engine
 * @requires TatUi.TatEngine TatEngine Provider
 *
 * @description List groups controller
 *
 */
angular.module('TatUi')
    .controller('GroupsEditCtrl', function($scope, $stateParams, Authentication, TatEngineUsersRsc, TatEngineGroupsRsc, TatEngineGroupRsc, TatEngine) {
    'use strict';

    $scope.group = {};
    $scope.user = {};
    var _self = this;
    this.init = function() {
      TatEngineGroupsRsc.list({idGroup : $stateParams.groupId}).$promise.then(function(data){
        if (data.count === 1) {
          $scope.group = data.groups[0];
        }
      }, function(err) {
          TatEngine.displayReturn(err);
      });

      TatEngineUsersRsc.list().$promise.then(function(data){
        $scope.users = data.users;
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    this.initRequest = function(username) {
        return {'groupname': $scope.group.name, 'username': username};
    };

    /**
     * @ngdoc function
     * @name addUser
     * @methodOf TatUi.controller:GroupsEditCtrl
     * @description Add a user to a group
     *
     */
    $scope.addUser = function() {
      var r = _self.initRequest($scope.user.selected.username);
      TatEngineGroupRsc.addUser(r).$promise.then(function(){
        _self.init();
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name removeUser
     * @methodOf TatUi.controller:GroupsEditCtrl
     * @description Remove a user from a group
     *
     */
    $scope.removeUser = function(username) {
      TatEngineGroupRsc.removeUser(_self.initRequest(username)).$promise.then(function(){
        _self.init();
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name addAdmin
     * @methodOf TatUi.controller:GroupsEditCtrl
     * @description Add an admin to a group
     *
     */
    $scope.addAdmin = function() {
      var r = _self.initRequest($scope.user.selected.username);
      TatEngineGroupRsc.addAdmin(r).$promise.then(function(){
        _self.init();
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name removeAdmin
     * @methodOf TatUi.controller:GroupsEditCtrl
     * @description Remove an admin from a group
     *
     */
    $scope.removeAdmin = function(username) {
      TatEngineGroupRsc.removeAdmin(_self.initRequest(username)).$promise.then(function(){
        _self.init();
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    this.init();
});
