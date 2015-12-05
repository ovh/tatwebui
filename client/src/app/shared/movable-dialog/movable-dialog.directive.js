/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.directive:movableDialog
 * @restrict AE
 * @description
 * Create a non modal dialog
 */
angular.module('TatUi').directive('movableDialog', function($document) {
  'use strict';

  return {
    restrict: 'EA',
    replace: true,
    scope: {
      title: '=?',
      ngModel: '=?'
    },
    transclude: true,
    templateUrl: 'app/shared/movable-dialog/movable-dialog.directive.html',
    link: function(scope, element) {
      scope.ngModel = angular.extend({
          x: 0,
          y: 0,
          visible: true
        },
        scope.ngModel
      );
      var startX = scope.ngModel.x;
      var startY = scope.ngModel.y;

      var header = element.find('.dialog-header');

      element.css({
        position: 'relative',
        top: scope.ngModel.y + 'px',
        left: scope.ngModel.x + 'px'
      });

      header.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - scope.ngModel.x;
        startY = event.pageY - scope.ngModel.y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        scope.ngModel.y = event.pageY - startY;
        scope.ngModel.x = event.pageX - startX;
        element.css({
          top: scope.ngModel.y + 'px',
          left: scope.ngModel.x + 'px'
        });
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
    }
  };



});
