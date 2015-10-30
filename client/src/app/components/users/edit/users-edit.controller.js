/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:UsersEditCtrl
 * @requires TatUi.TatEngineUsersRsc  Tat Engine Users Resource
 * @requires TatUi.TatEngineUserRsc   Tat Engine User Resource
 * @requires TatUi.TatEngineGroupsRsc Tat Engine Groups Resource
 * @requires TatUi.TatEngineGroupRsc  Tat Engine Group Resource
 * @requires TatEngine                Tat Engine Provider
 * @description User Edit Controller
 */
angular.module('TatUi')
    .controller('UsersEditCtrl', function($scope, $state, $stateParams, TatEngineUsersRsc, TatEngineUserRsc, TatEngineGroupsRsc, TatEngineGroupRsc, TatEngine) {
    'use strict';

    $scope.group = {};
    $scope.user = {};

    var _self = this;

    /**
     * @ngdoc function
     * @name init
     * @methodOf TatUi.controller:UsersEditCtrl
     * @description Initialize User Edit page
     */
    this.init = function() {
      $scope.askArchiveUser = false;
      $scope.askConvertSystemUser = false;
      $scope.askConvertAdminUser = false;
      $scope.askRenameUser = false;
      $scope.askUpdateUser = false;

      TatEngineUsersRsc.list({username : $stateParams.username, withGroups:true}).$promise.then(function(data){
        if (data.count == 1) {
          $scope.user = data.users[0];

          $scope.newFullname = $scope.user.fullname;
          $scope.newEmail = $scope.user.email;
        }
      }, function(err) {
          TatEngine.displayReturn(err);
      });

      TatEngineGroupsRsc.list().$promise.then(function(data){
        $scope.groups = data.groups;
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name initRequest
     * @methodOf TatUi.controller:UsersEditCtrl
     * @description Init Request (Body Json) with groupname and username
     */
    this.initRequest = function(groupname) {
        return {'groupname': groupname, 'username': $scope.user.username};
    };

    /**
     * @ngdoc function
     * @name addUserInGroup
     * @methodOf TatUi.controller:UsersEditCtrl
     * @description Add a user into a group
     */
    $scope.addUserInGroup = function() {
      var r = _self.initRequest($scope.group.selected.name);
      TatEngineGroupRsc.addUser(r).$promise.then(function(data){
        _self.init();
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name removeUserFromGroup
     * @methodOf TatUi.controller:UsersEditCtrl
     * @param {string} groupname Name of group
     * @description Remove a user from a group
     */
    $scope.removeUserFromGroup = function(groupname) {
      TatEngineGroupRsc.removeUser(_self.initRequest(groupname)).$promise.then(function(data){
        _self.init();
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name archiveUser
     * @methodOf TatUi.controller:UsersEditCtrl
     * @description Archive current user
     */
    $scope.archiveUser = function() {
      TatEngineUserRsc.archive({'username': $scope.user.username}).$promise.then(function(data){
        $state.go('users-list');
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name convertSystemUser
     * @methodOf TatUi.controller:UsersEditCtrl
     * @param {bool} canWriteNotifications Converted user can writes on Notifications Topic
     * @description Convert a user to a system user
     */
    $scope.convertSystemUser = function(canWriteNotifications) {
      TatEngineUserRsc.convert({'username': $scope.user.username, 'canWriteNotifications': canWriteNotifications}).$promise.then(function(data){
        _self.init();
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name convertAdminUser
     * @methodOf TatUi.controller:UsersEditCtrl
     * @description Grant a user to admin rights
     */
    $scope.convertAdminUser = function() {
      TatEngineUserRsc.setAdmin({'username': $scope.user.username}).$promise.then(function(data){
        _self.init();
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    /**
     * @ngdoc function
     * @name renameUser
     * @methodOf TatUi.controller:UsersEditCtrl
     * @description Rename username of user
     */
    $scope.renameUser = function() {
      TatEngineUserRsc.rename({'username': $scope.user.username, 'newUsername': $scope.newUsername}).$promise.then(function(data){
        $state.go('users-edit', {username: $scope.newUsername});
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };


    /**
     * @ngdoc function
     * @name updateUser
     * @methodOf TatUi.controller:UsersEditCtrl
     * @description Update fullname and email of user
     */
    $scope.updateUser = function() {
      TatEngineUserRsc.update({'username': $scope.user.username, 'newFullname': $scope.newFullname, 'newEmail': $scope.newEmail}).$promise.then(function(data){
        _self.init();
      }, function(err) {
          TatEngine.displayReturn(err);
      });
    };

    this.init();
});
