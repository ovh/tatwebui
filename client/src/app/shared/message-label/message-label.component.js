/*global angular*/

/**
 * @ngdoc directive
 * @name TatUi.shared:messageLabel
 * @restrict AE
 * @description
 * Create a generic message label
 */
angular.module('TatUi').component('messageLabel',
{
  bindings: {
    message: '=',
    topic: '=',
    isDisplayed: '='
  },
  controllerAs: 'ctrl',
  controller: function(
    $scope,
    TatEngineMessageRsc,
    TatEngine,
    TatMessage,
    $sce
  ) {
    'use strict';

    var self = this;
    self.labelColor = '#d04437';
    self.labelText = '';
    self.labels = [];

    this.palette = [
      ["#d04437", "#14892c", "#5484ed"],
      ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3",
        "#fff"
      ],
      ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
      ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3",
        "#cfe2f3", "#d9d2e9", "#ead1dc"
      ],
      ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9",
        "#9fc5e8", "#b4a7d6", "#d5a6bd"
      ],
      ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af",
        "#6fa8dc", "#8e7cc3", "#c27ba0"
      ],
      ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6",
        "#674ea7", "#a64d79"
      ],
      ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394",
        "#351c75", "#741b47"
      ],
      ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763",
        "#20124d", "#4c1130"
      ]
    ];

    self.getBrightness = function(rgb) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgb);
      return result ?
        0.2126 * parseInt(result[1], 16) +
        0.7152 * parseInt(result[2], 16) +
        0.0722 * parseInt(result[3], 16) : 0;
    };

    self.getBrightnessColor = function(rgb) {
      if (self.getBrightness(rgb) > 130) {
        return '#000000';
      }
      return '#ffffff';
    };

    self.suggest_labels = function (term) {
      var results = [];
      if (!self.topic || !self.topic.labels) {
        return results;
      }
      var q = term.toLowerCase().trim();
      for (var i = 0; i < self.topic.labels.length && results.length < 10; i++) {
        var label = self.topic.labels[i];
        if (label.text.toLowerCase().indexOf(q) === 0) {
          results.push({ obj:label, value: label.text,
          label:$sce.trustAsHtml(
           '<div class="row">' +
           ' <div class="col-xs-5 tat-label-suggestion">' +
           ' <span class="tat-label" ' +
           ' style="background-color:' + label.color + ' ; ' +
           ' border-right-color: ' + label.color + ' ; ' +
           ' color: '+ self.getBrightnessColor(label.color) +'">' +
           label.text +
           ' </span>' +
           ' </div>' +
           '</div>') });
        }
      }
      return results;
    };

    self.suggest = function (term, fnc) {
      var ix = term.lastIndexOf(','),
          lhs = term.substring(0, ix + 1),
          rhs = term.substring(ix + 1),
          suggestions = fnc(rhs);
      suggestions.forEach(function (s) {
        s.value = lhs + s.value;
      });
      return suggestions;
    };

    self.suggest_labels_delimited = function (term) {
      if (!self.topic || !self.topic.topic) {
        return;
      }
      return self.suggest(term, self.suggest_labels);
    };

    $scope.autocomplete_options_labels = {
      suggest: self.suggest_labels_delimited,
      on_select: function (selected) {
        self.labelColor = selected.obj.color;
      }
    };

    /**
     * @ngdoc function
     * @name addLabel
     * @methodOf TatUi.shared:messageLabel
     * @description Add a label
     * @param {object} message Message on which to add a label
     */
    this.addLabel = function(message) {
      TatMessage.addLabel(self.message,
        self.topic.topic,
        self.labelText,
        self.labelColor,
        function() {
          self.isDisplayed = false;
        }
      );
    };

  },
  templateUrl: 'app/shared/message-label/message-label.component.html'
});
