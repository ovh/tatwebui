/**
 * @ngdoc service
 * @name TatUi.TatMessageProvider
 * @module TatUi
 * @description
 *
 * Manage Tat message filters
 *
 */
angular.module('TatUi')
  .provider('TatMessage', function(appConfiguration) {
    'use strict';

    var self = this;

    return {
      /**
       * @ngdoc function
       * @name addLabel
       * @methodOf TatUi.TatMessageProvider
       */
      $get: function(TatEngine, TatEngineMessageRsc) {

        self.addLabel = function(message, topicName, labelText, labelColor, cb) {
          TatEngineMessageRsc.update({
            'action': 'label',
            'topic': topicName,
            'idReference': message._id,
            'text': labelText,
            'option': labelColor
          }).$promise.then(function(resp) {
            if (!message.labels) {
              message.labels = [];
            }
            message.labels.push({
              text: labelText,
              color: labelColor
            });
            if (cb) {
              cb();
            }
          }, function(resp) {
            TatEngine.displayReturn(resp);
          });
        };

        return {
          addLabel: self.addLabel
        };
      }
    };
  });
