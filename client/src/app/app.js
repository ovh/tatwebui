/*global angular,console*/

angular.module('TatUi', [
    'tat.config',
    'ui.bootstrap',
    'ui.bootstrap.modal',
    'ui.bootstrap.datetimepicker',
    'ui.router',
    'ui.select',
    'ngCookies',
    'ngStorage',
    'ngSanitize',
    'pascalprecht.translate',
    'ngResource',
    'ngWebsocket',
    'flash',
    'angularMoment',
    'colorpicker.module',
    'infinite-scroll',
    'angularSpectrumColorpicker',
    'ngDraggable',
    'chart.js'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  })

  .config(function($httpProvider) {
    'use strict';
    $httpProvider.interceptors.push('TatEngineInterceptor');
})

.config(function($translateProvider, $windowProvider) {
  'use strict';
  $translateProvider.useCookieStorage();

  // http://angular-translate.github.io/docs/#/guide/19_security
  $translateProvider.useSanitizeValueStrategy('escape');

  // set default and fallback languages
  $translateProvider.preferredLanguage('fr');
  $windowProvider.$get().moment.locale('fr');

  // define translation loader
  $translateProvider.useLoader("$translatePartialLoader", {
    urlTemplate: function(part, lang) {
      return 'assets/app/' + part + '/translations/' + lang.replace(
        /_.*$/, '') + '.json';
    }
  });
})

.config(function($urlMatcherFactoryProvider) {
  'use strict';
  $urlMatcherFactoryProvider.type('topicRoute', {
    encode: function(val) {
      return val !== null && val !== undefined ? val.toString() : val;
    },
    decode: function(val) {
      return val !== null && val !== undefined ? val.toString() : val;
    },
    is: function(val) {
      return this.pattern.test(val);
    }
  });
})

.run(function(Authentication) {
  'use strict';
  moment.locale('fr', {
    calendar: {
      lastDay: '[Yesterday], dddd MMM D H:mm:ss',
      sameDay: '[Today], H:mm:ss',
      nextDay: '[Tomorrow], dddd MMM D H:mm:ss',
      lastWeek: 'dddd, MMM D H:mm:ss',
      nextWeek: 'dddd, MMM D H:mm:ss',
      sameElse: 'dddd, MMM D H:mm:ss'
    }
  });
})

.run(function(Authentication) {
  'use strict';
  Authentication.refreshIdentity();
})

.run(function($rootScope, $translatePartialLoader, $translate, Authentication,
  $state) {
  'use strict';

  // manage route change

  $translate.refresh();
  $rootScope.$on("$stateChangeStart", function(event, routeOption) {
    if ((!routeOption.acl_bypass) && (!Authentication.isConnected())) {
      event.preventDefault();
      $state.go('user-login');
    }
    $translatePartialLoader.addPart('shared');
    if (routeOption.translations) {
      // load translation parts
      angular.forEach(routeOption.translations, function(part) {
        var tab = part.split('/');
        var partToLoad = '';

        for (var i = 0; i < tab.length; i++) {
          if (i > 0) {
            partToLoad += "/" + tab[i];
          } else {
            partToLoad += tab[i];
          }
          // avoid get on /assets/app/plugins/fr.json
          if (partToLoad != "plugins") {
            $translatePartialLoader.addPart(partToLoad);
          }
        }
      });
      $translate.refresh();
    }
    $translate.refresh();
  });
});
