/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.shared:messageVote
 * @restrict AE
 * @description
 * Create a generic message vote
 */
angular.module('TatUi').component('messageVote',
{
  bindings: {
    message: '=',
    topic: '='
  },
  controllerAs: 'MessageVote',
  controller: function(
    $scope,
    Authentication,
    TatEngine,
    TatEngineMessageRsc
  ) {
    'use strict';

    var self = this;

    self.voterUPDisabled = false;
    self.voterDownDisabled = false;

    /**
     * @ngdoc function
     * @name hasVoterUP
     * @methodOf TatUi.shared:messageVote
     * @description Define if the message is marked 'voteUP'
     * @return {bool} If true, 'voteUP'
     */
    self.hasVoterUP = function() {
      if (self.message && self.message.votersUP) {
        return _.include(self.message.votersUP, Authentication.getIdentity()
          .username);
      }
      return false;
    };

    /**
     * @ngdoc function
     * @name hasVoterDown
     * @methodOf TatUi.shared:messageVote
     * @description Define if the message is marked 'voteDown'
     * @return {bool} If true, 'voteDown'
     */
    self.hasVoterDown = function() {
      if (self.message && self.message.votersDown) {
        return _.include(self.message.votersDown, Authentication.getIdentity()
          .username);
      }
      return false;
    };

    /**
     * @ngdoc function
     * @name toggleVoterUP
     * @methodOf TatUi.shared:messageVote
     * @description toggle 'voterUP' on the message
     *
     */
    self.toggleVoterUP = function() {
      self.voterUPDisabled = true;
      var action = self.hasVoterUP(self.message) ? 'unvoteup' : 'voteup';
      TatEngineMessageRsc.update({
        'topic': self.topic,
        'idReference': self.message._id,
        'action': action
      }).$promise.then(function(resp) {
        if (resp.message) {
          self.updateAfterVote(resp.message);
        }
        self.voterUPDisabled = false;
      }, function(err) {
        TatEngine.displayReturn(err);
        self.voterUPDisabled = false;
      });
    };

    /**
     * @ngdoc function
     * @name toggleVoterDown
     * @methodOf TatUi.shared:messageVote
     * @description toggle 'voterDown' on the message
     *
     */
    self.toggleVoterDown = function() {
      self.voterDownDisabled = true;
      var action = self.hasVoterDown(self.message) ? 'unvotedown' : 'votedown';
      TatEngineMessageRsc.update({
        'topic': self.topic,
        'idReference': self.message._id,
        'action': action
      }).$promise.then(function(resp) {
        if (resp.message) {
          self.updateAfterVote(resp.message);
        }
        self.voterDownDisabled = false;
      }, function(err) {
        TatEngine.displayReturn(err);
        self.voterDownDisabled = false;
      });
    };

    self.updateAfterVote = function(newMessage) {
      self.message.votersUP = newMessage.votersUP;
      self.message.nbVotesUP = newMessage.nbVotesUP;
      self.message.votersDown = newMessage.votersDown;
      self.message.nbVotesDown = newMessage.nbVotesDown;
      if (!self.message.votersUP) {
        self.message.votersUP = [];
      }
      if (!self.message.votersDown) {
        self.message.votersDown = [];
      }
    };

  },
  templateUrl: 'app/shared/message-vote/message-vote.component.html'
});
