/*global angular*/
angular.module('TatUi').directive('dashingCssParser', ['$document', '$sanitize', function($document, $sanitize) {
    return {
        restrict: 'A',
        scope: {
            dashingCssParser : '<'
        },
        link: function (scope, element, attrs) {
            var domStyleElement;
            var currentDashingCssParserValue = null;

            /**
             * dashingListener: Listener which processes all the message labels into CSS and/or classes
             * @param newVal
             */
            var dashingListener = function (newVal) {
                // Only process when a new value is detected
                if (angular.equals(newVal, currentDashingCssParserValue)) {
                    return;
                } else {
                    currentDashingCssParserValue = angular.copy(newVal);
                }

                var elementCssClass = '';
                var elementCompleteStyle = [];

                // Go through all message labels
                for (var i = 0; i < currentDashingCssParserValue.length; i++) {
                    var label = currentDashingCssParserValue[i];
                    var labelText = $sanitize(currentDashingCssParserValue[i].text)
                        .replace(/&gt;/g, '>')
                        .replace(/&lt;/g, '<')
                        .replace(/&amp;/g, '&')
                        .replace(/&#34;/g, '"');
                    var parsedCssString = '';

                    // Legacy support
                    switch (labelText) {
                        case 'AL':
                        case 'open':
                            if (!elementCssClass) {
                                elementCssClass = 'btn-danger';
                            }
                            continue;
                        case 'UP':
                        case 'done':
                            if (!elementCssClass) {
                                elementCssClass = 'btn-success';
                            }
                            continue;
                        case 'WARN':
                            if (!elementCssClass) {
                                elementCssClass = 'btn-warning';
                            }
                            continue;
                    }

                    if (labelText.indexOf('style:') === 0) {
                        // IF : New syntax to parse CSS : "style:selector { property: value; }"

                        var labelTextCss = labelText.substring(6);
                        // If the text to be parsed has the following form:
                        // "selector { property: value; }" or "property: value;",
                        // we can parse it as a CSS string
                        if (/^[^{}<;]+{ ?[a-z0-9\-]+:[a-z0-9 .%]+; ?}$|^[a-z0-9\-]+:[a-z0-9 .%]+;$/.test(labelTextCss)) {
                            // CSS with selector
                            parsedCssString = processCss(labelTextCss);
                        }
                    } else {
                        // ELSE : Legacy support
                        var labelColor = label.color;
                        var notCssRelatedLabel = (labelText.indexOf('value:') === 0) || (labelText.indexOf('order:') === 0) ||
                            (labelText.indexOf('widget:') === 0) || (labelText.indexOf('widget-min:') === 0) || (labelText.indexOf('widget-max:') === 0) ||
                            (labelText.indexOf('widget-mode:') === 0) || (labelText.indexOf('widget-class:') === 0) || (labelText.indexOf('percentRunning:') === 0) ||
                            (labelText.indexOf('widget-value:') === 0) || (labelText.indexOf('widget-options:') === 0) ||
                            (labelText.indexOf('widget-data-labels:') === 0) || (labelText.indexOf('widget-data-serie:') === 0) || (labelText.indexOf('widget-data-series:') === 0);

                        if (notCssRelatedLabel) {
                            continue;
                        }

                        parsedCssString = processLegacyCss(labelText, labelColor);
                    }

                    // Memorize the CSS if it has been processed
                    if (parsedCssString) {
                        elementCompleteStyle.push(parsedCssString);
                    }
                }

                if (elementCompleteStyle.length > 0) {
                    // IF : Some custom styles have been set, inject them
                    domStyleElement = computeCustomCssStyle(elementCompleteStyle, domStyleElement);
                } else {
                    // ELSE : Legacy support
                    // No custom styles have been set, set element's class
                    computeDefaultCssStyle(elementCssClass);
                }
            };

            /**
             * processCss: Translates text into CSS following a new "style:selector { property: value; }" syntax
             * or "style:property: value;" syntax
             * @param labelTextCss
             * @returns {string}
             */
            var processCss = function(labelTextCss) {
                var cssSelectorPropertyArray = labelTextCss.split('{');
                var cssPropertyValueArray = [];
                var cssSelector = '';
                var cssProperty = '';
                var cssValue = '';
                var parsedCssString = '';

                if (cssSelectorPropertyArray.length === 2) {
                    // CSS string has the following form : "selector { property: value; }"
                    cssPropertyValueArray = cssSelectorPropertyArray[1].split(':');
                    cssSelector = '#' + attrs.id + ' ' + cssSelectorPropertyArray[0].trim();
                } else if (cssSelectorPropertyArray.length === 1) {
                    // CSS string has the following form : "property: value;"
                    cssPropertyValueArray = cssSelectorPropertyArray[0].split(':');
                    cssSelector = '#' + attrs.id;
                }

                if (cssPropertyValueArray.length === 2) {
                    cssProperty = cssPropertyValueArray[0].trim();
                    cssValue = cssPropertyValueArray[1].split(';')[0].trim();
                }

                if (cssSelector && cssProperty && cssValue) {
                    parsedCssString = cssSelector + '{' + cssProperty + ':' + cssValue + ';}';
                }

                return parsedCssString;
            };

            // Legacy support
            /**
             * processLegacyCss: Translates some specific text into some specific CSS properties following legacy syntax
             * @param labelText
             * @param labelColor
             * @returns {string}
             */
            var processLegacyCss = function(labelText, labelColor) {
                var cssSelector = '#' + attrs.id;
                var cssProperty = '';
                var cssValue = '';
                var parsedCssString = '';

                switch (true) {
                    case labelText.indexOf('bg-color') === 0:
                        cssProperty = 'background-color';
                        cssValue = labelColor;
                        break;
                    case labelText.indexOf('title-font-size') === 0:
                        cssSelector += ' > div > h3.dashtitle';
                        cssProperty = 'font-size';
                        cssValue = labelText.substring(16);
                        break;
                    case labelText.indexOf('value-font-size') === 0:
                        cssSelector += ' > .boxmiddle > h1.dashvalue';
                        cssProperty = 'font-size';
                        cssValue = labelText.substring(16);
                        break;
                    case labelText.indexOf('color') === 0:
                        cssProperty = 'color';
                        cssValue = labelColor;
                        break;
                    case labelText.indexOf('hide-bottom') === 0:
                        cssSelector += ' > div.dashbottom';
                        cssProperty = 'display';
                        cssValue = 'none';
                        break;
                    case labelText.indexOf('url:') === 0:
                        cssProperty = 'cursor';
                        cssValue = 'pointer';
                        break;
                    case labelText.indexOf('height:') === 0:
                        cssProperty = 'height';
                        cssValue = labelText.substring(7);
                        break;
                    case labelText.indexOf('width:') === 0:
                        cssProperty = 'width';
                        cssValue = labelText.substring(6);
                        break;
                    case labelText.indexOf('border-width') === 0:
                        cssProperty = 'border-width';
                        cssValue = labelText.substring(13);
                        break;
                    case labelText.indexOf('border-style') === 0:
                        cssProperty = 'border-style';
                        cssValue = labelText.substring(13);
                        break;
                    case labelText.indexOf('border-color') === 0:
                        cssProperty = 'border-color';
                        cssValue = labelText.substring(13);
                        break;
                }

                if (cssSelector && cssProperty && cssValue) {
                    parsedCssString = cssSelector + '{' + cssProperty + ':' + cssValue + ';}';
                }

                return parsedCssString;
            };

            /**
             * computeCustomCssStyle: Injects the processed CSS styles into a <style> tag appended at the end of the <head> tag
             * @param elementCompleteStyle
             * @param domStyleElement
             * @returns {*|Object}
             */
            var computeCustomCssStyle = function (elementCompleteStyle, domStyleElement) {
                var headTag = $document.find('head');
                var completeStyleString = '';
                var oldDomStyleElement = domStyleElement;

                for (var i = 0; i < elementCompleteStyle.length; i++) {
                    completeStyleString += elementCompleteStyle[i];
                }

                domStyleElement = angular.element('<style type="text/css"></style>');
                domStyleElement.text(completeStyleString);

                if (!oldDomStyleElement) {
                    headTag.append(domStyleElement);
                } else {
                    headTag.append(domStyleElement);
                    oldDomStyleElement.remove();
                }

                return domStyleElement;
            };

            // Legacy support
            /**
             * computeDefaultCssStyle: Adds some classes to the message if no custom styles have been set
             * @param elementCssClass
             */
            var computeDefaultCssStyle = function (elementCssClass) {
                if (!elementCssClass) {
                    elementCssClass = 'btn-warning';
                }

                if (element.hasClass('btn-danger') || element.hasClass('btn-success') || element.hasClass('btn-warning')) {
                    if (element.hasClass('btn-danger') && elementCssClass !== 'btn-danger') {
                        element.addClass(elementCssClass);
                        element.removeClass('btn-danger');
                    }

                    if (element.hasClass('btn-success') && elementCssClass !== 'btn-success') {
                        element.addClass(elementCssClass);
                        element.removeClass('btn-success');
                    }

                    if (element.hasClass('btn-warning') && elementCssClass !== 'btn-warning') {
                        element.addClass(elementCssClass);
                        element.removeClass('btn-warning');
                    }
                } else {
                    element.addClass(elementCssClass);
                }
            };

            // Start listener
            var deregisterDashingListener = scope.$watch('dashingCssParser', dashingListener);

            // Handle message destruction
            scope.$on('$destroy', function() {
                if (domStyleElement) {
                    domStyleElement.remove();
                }
                deregisterDashingListener();
            });
        }
    };
}]);
