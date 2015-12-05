/*global angular */

/**
 * @ngdoc controller
 * @name TatUi.controller:SocketsAdminCtrl
 * @requires TatUi.TatEngineSocketsRsc Tat Engine sockets resource
 * @requires TatUi.TatEngine
 * @description Socket Admin controller
 */
angular.module('TatUi')
  .controller('SocketsAdminCtrl', function($scope, TatEngineSocketsRsc,
    TatEngine) {
    'use strict';

    /**
     * @ngdoc function
     * @name init
     * @methodOf TatUi.controller:SocketsAdminCtrl
     * @description Initialize socket admin page
     */
    this.init = function() {
      TatEngineSocketsRsc.actionDump({}).$promise.then(function(data) {
        $scope.socketsDump = data;
      }, function(err) {
        TatEngine.displayReturn(err);
      });
    };

    this.init();
  });
