/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.directive:topicList
 * @restrict AE
 * @description
 * display all topics
 */
angular.module('TatUi').directive('topicList', function() {
    'use strict';
    return {
        retrict: 'AE',
        template: '<ul class="sidebar-sublist"><li data-ng-repeat="topic in topicList track by topic.name" topic-list-item="topic" data-ng-click="topicClick(topic);$event.stopPropagation();"></li></ul>',
        scope: {
            topicList: '='
        },
        replace: true,
        controller: function($scope, $rootScope) {
            /**
             * @ngdoc function
             * @name topicClick
             * @methodOf TatUi.directive:topicList
             * @description
             *  Invoked when a topic is clicked
             * @param {object} topic Topic that recieved the click
             */
            $scope.topicClick = function(topic) {
                topic.visible = !topic.visible;
                if (topic.metadata) {
                    $rootScope.$broadcast('topic-change', {topic:topic.metadata.topic});
                }
                $rootScope.$broadcast('sidebar-change', {topic:topic});
            };
        }
    };
})

/**
 * @ngdoc directive
 * @name TatUi.directive:topicListItem
 * @restrict AE
 * @description
 * display a sub topic
 */
.directive('topicListItem', function($compile) {
        'use strict';
    return {
        retrict: 'AE',
        templateUrl: 'app/shared/topic/topic-item.directive.html',
        scope: {
            topicListItem: '='
        },
        replace: true,
        link: function(scope, element) {
            //scope.spaces = new Array(scope.topicListItem.level);
            scope.spaces=[];
            for (var i=0; i<scope.topicListItem.level; i++) {
                scope.spaces.push(i);
            }
            element.append('<div topic-list="topicListItem.children" data-ng-show="topicListItem.visible"></div>');
            $compile(element.contents())(scope);
        },
        controller: function ($scope) {
            $scope.getNbUnread = function(topic) {
                var nbUnread = 0;
                var newTopic = false;
                if (topic.metadata !== undefined && topic.metadata.unRead !== undefined) {
                    if (topic.metadata.unRead == -1) {
                      newTopic = true;
                    } else {
                      nbUnread += topic.metadata.unRead;
                    }
                }
                if (!topic.visible) {
                    var childUnread = $scope.getUnreadInChild(topic);
                    if (childUnread != "New Topic") {
                      nbUnread += childUnread;
                    } else {
                      newTopic = true;
                    }
                }
                if (newTopic && topic.metadata !== undefined) {
                  return "New Topic";
                }
                if (nbUnread > 0) {
                    return nbUnread;
                } else {
                    return "";
                }
            };

            $scope.getUnreadInChild  = function(topic) {
                var nbUnread = 0;
                var newTopic = false;
                for (var i=0;i<topic.children.length;i++) {
                    if (topic.children[i].metadata !== undefined && topic.children[i].metadata.unRead !== undefined) {
                        if (topic.children[i].metadata.unRead == -1) {
                            newTopic = true;
                        } else {
                            nbUnread += topic.children[i].metadata.unRead;
                        }
                    }
                    if (!topic.visible) {
                        var childUnread = $scope.getUnreadInChild(topic.children[i]);
                        if (childUnread != "New Topic") {
                            nbUnread += childUnread;
                        } else {
                            newTopic = true;
                        }
                    }
                }
                if (newTopic && topic.metadata !== undefined) {
                  return "New Topic";
                }
                return nbUnread;
            };
        }
    };
});
