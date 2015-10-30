/*global angular*/
angular.module('TatUi').controller('UserProfileCtrl', function ($scope, Identity, $state, Authentication, TatEngine) {
    'use strict';

    $scope.user = Identity.getIdentity();

    $scope.resetPassword = function() {
        Authentication.reset($scope.user.username, $scope.user.email).then(
            function(data) {
                $state.go('user-signup-done');
            }, function(err) {
                $scope.user = {};
                TatEngine.displayReturn(err);
            });
    };
    
});
