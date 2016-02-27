/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.directive:codeHighlight
 * @restrict AE
 * @description
 * usage:
 * <code-highlight source="codeToHighlight" type="{{ codeType }}" disable-highlighting="{{ disableHighlighting }}"></code-highlight>
 * https://github.com/PrismJS/prism/issues/612
 */
angular.module('TatUi').directive('codeHighlight', ['$compile', '$timeout',
  function ($compile, $timeout) {
      "use strict";
      return {
          restrict: 'E',
          scope: {
            type: '@',
            source: '=',
            disableHighlighting: '@'
          },
          link: function(scope, element) {
            var timeout;
            scope.$watch('source', function(value) {
              if (!value) return;
              element.html('<pre class="line-numbers"><code>{{ source }}</code></pre>');
              $compile(element.contents())(scope);
              var code = element.find('code')[0];
              code.className = 'language-'+scope.type;
              if (scope.disableHighlighting !== 'true') {
                timeout = $timeout(function() {
                  Prism.highlightElement(code);
                }, 0, false);
              } else {
                element.find('pre')[0].className = 'language-'+scope.type + ' line-numbers';
              }
            });

            scope.$on('$destroy', function () {
              $timeout.cancel( timeout );
            });
          }
      };
}]);
