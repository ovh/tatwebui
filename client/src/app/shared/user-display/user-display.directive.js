/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.directive:userDisplay
 * @restrict AE
 * @description
 * display fullname or username and redirect to DM topic
 */
angular.module('TatUi').directive('userDisplay', function() {
  'use strict';
  return {
    retrict: 'AE',
    template: '<span><span data-ng-if="isSameUser()">{{getFullname()}}</span><a data-ng-if="!isSameUser()" class="link">{{getFullname()}}</a></span>',
    scope: {
      username: '=',
      fullname: '=',
    },
    replace: true,
    controller: function($scope, $rootScope, Linker, Authentication) {

      $scope.isSameUser = function() {
        return $scope.username === Authentication.getIdentity().username;
      };

      /**
       * @ngdoc function
       * @name getFullname
       * @methodOf TatUi.directive:userDisplay
       * @description
       *  Invoked when a user is display
       * return fullname if exists of username
       */
      $scope.getFullname = function() {
        if ($scope.fullname && $scope.fullname !== "") {
          return $scope.fullname;
        }
        return $scope.username;
      };
    }
  };
});
