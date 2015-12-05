/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.directive:configUrls
 *
 * @description
 * display url configured in config.json file. See config.json.template
 *
 */
angular.module('TatUi').directive('configUrls', function rdLoading() {
  return {
    retrict: 'AE',
    template: '<ul class="configUrls"><li ng-repeat="l in links"><a href="{{l.url}}">{{l.caption}}</a></li></ul>',
    scope: {
      configUrls: '='
    },
    replace: true,
    controller: function($scope, appConfiguration) {
      if (appConfiguration.links && appConfiguration.links[$scope.configUrls]) {
        $scope.links = appConfiguration.links[$scope.configUrls];
      } else {
        $scope.links = [];
      }
    }
  };
});
