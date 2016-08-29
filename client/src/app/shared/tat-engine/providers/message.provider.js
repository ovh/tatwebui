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
            'topic': topicName.indexOf("/") === 0 ? topicName.substr(1) : topicName,
            'idReference': message._id,
            'text': labelText,
            'option': labelColor
          }).$promise.then(function(resp) {
            if (!message.labels) {
              message.labels = [];
            }
            if (resp.message && resp.message.labels) {
              message.labels = resp.message.labels;
              message.dateUpdate = resp.message.dateUpdate;
            }
            if (cb) {
              cb();
            }
          }, function(resp) {
            TatEngine.displayReturn(resp);
          });
        };

        // Request: {
        // "idReference":"57b302fd2683910e061e185d",
        // "action":"relabel",
        // "labels":[{"text":"b1","color":"#EEEE"},{"text":"a2","color":"#EEEE"}],
        // "options":["myLabel1"]}
        self.reLabel = function(message, topicName, labels, labelsToRemove, cb) {
          TatEngineMessageRsc.update({
            'action': 'relabel',
            'topic': topicName.indexOf("/") === 0 ? topicName.substr(1) : topicName,
            'idReference': message._id,
            'labels': labels,
            'options': labelsToRemove
          }).$promise.then(function(resp) {
            if (!message.labels) {
              message.labels = [];
            }
            if (resp.message && resp.message.labels) {
              message.labels = resp.message.labels;
              message.dateUpdate = resp.message.dateUpdate;
            }
            if (cb) {
              cb();
            }
          }, function(resp) {
            TatEngine.displayReturn(resp);
          });
        };

        return {
          addLabel: self.addLabel,
          reLabel: self.reLabel
        };
      }
    };
  });
