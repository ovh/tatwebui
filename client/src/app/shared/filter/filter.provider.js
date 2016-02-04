/**
 * @ngdoc service
 * @name TatUi.TatFilterProvider
 * @module TatUi
 * @description
 *
 * Manage Tat message filters
 *
 */
angular.module('TatUi')
  .provider('TatFilter', function(appConfiguration) {
    'use strict';

    var self = this;

    self.FILTERS = [
      'label',
      'andLabel',
      'notLabel',
      'tag',
      'andTag',
      'notTag',
      'text',
      'idMessage'
    ];

    self.topic = null;
    self.options = {};
    self.currentFilters = {};

    for (var i = 0; i < self.FILTERS.length; i++) {
      self.currentFilters[self.FILTERS[i]] = null;
    }

    return {
      /**
       * @ngdoc function
       * @name addEvent
       * @methodOf TatUi.TatFilterProvider
       * @description
       *
       * Add an event on the websocket
       *
       * @param   {string}   eventName Name of the event to listen
       * @param   {function} callback  Callback function. It needs one data parameter
       * @returns {function} Function to invoke for killing the event
       */
      // addEvent: addEvent,
      $get: function($rootScope, $localStorage, $location, $stateParams) {

          self.topic = $stateParams.topic;

          if (!$localStorage.filters) {
            $localStorage.filters = {};
          }
          if (!$localStorage.filters[self.topic]) {
            $localStorage.filters[self.topic] = {};
          }

          self.eachFilter = function(callback) {
            for (var i = 0; i < self.FILTERS.length; i++) callback(self.FILTERS[i]);
          };

          self.sanitize = function(f) {
            // Removes spaces & duplicate (preserve order)
            return (typeof(f) === 'undefined' || f === null) ? null : f.replace(/\s+/g, '')
              .split(',').reduce(function(p, c) {
                if (c !== '' && p.indexOf(c) < 0) p.push(c); return p;
              }, []).join(',');
          };

          var search = $location.search();
          self.eachFilter(function(k){
            // First check in query string and propagate to localstorage if necessary
            if (search[k] && search[k] !== '') {
              $localStorage.filters[self.topic][k] = search[k];
            }
            // Then pull filter from localstorage if they exists
            if ($localStorage.filters[self.topic][k]) {
              self.currentFilters[k] = $localStorage.filters[self.topic][k];
            }
          });

          $rootScope.filters = self.currentFilters;

          self.removeFilter = function(key, value) {
            var items, index, fltr;
            fltr = self.currentFilters[key];
            if (key == 'idMessage') {
              self.currentFilters.idMessage = null;
              $localStorage.filters[self.topic].idMessage = null;
              $location.search('idMessage', null);
              self.search();
            }
            else if (key == 'text') {
              self.currentFilters.text = null;
              $localStorage.filters[self.topic].text = null;
              $location.search('text', null);
              self.search();
            }
            else if (fltr) {
              items = self.currentFilters[key].split(',');
              index = items.indexOf(value);
              if (index > -1) items.splice(index, 1);
              self.currentFilters[key] = items.join(',');
              if (self.currentFilters[key] === '') self.currentFilters[key] = null;
              $localStorage.filters[self.topic][key] = null;
              $location.search(key, null);
              self.search();
            }
            return self;
          };

          self.applyFilters = function() {
            self.eachFilter(function(k){
              $localStorage.filters[self.topic][k] = self.currentFilters[k];
              $location.search(k, self.currentFilters[k]);
            });
            return self;
          };

          self.getCurrentFilters = function() {
            return self.currentFilters;
          };

          self.setFilter = function(k, v) {
            // Some users might include the pound sign to reference a tag
            if (k == 'tag' && v) {
              v = v.replace('#', '');
            }
            if (k !== 'text' && k !== 'idMessage') {
              self.currentFilters[k] = self.sanitize(v);
            }
            else {
              self.currentFilters[k] = (typeof(v) === 'string') ? v.replace(/(^\s+|\s+$)/g, ''): v;
            }
            $localStorage.filters[self.topic][k] = self.currentFilters[k];
            $location.search(k, self.currentFilters[k]);
            return self;
          };

          self.setFilters = function(filters){
            self.eachFilter(function(k){
              var fltr = filters[k];
              if (!fltr || typeof(fltr) === 'undefined' || fltr === '') {
                fltr = null;
              }
              self.setFilter(k, fltr);
            });
            return self;
          };

          self.search = function() {
            $rootScope.$broadcast('filter-changed', self.currentFilters);
          };

        /**
         * @ngdoc service
         * @module TatUi
         * @name TatUi.TatFilter
         *
         * @description
         *
         * manage message filters
         *
         */
        return {
          FILTERS: self.FILTERS,
          removeFilter: self.removeFilter,
          getCurrent: self.getCurrentFilters,
          setFilters: self.setFilters,
          eachFilter: self.eachFilter,
          search: self.search
        };
      }
    };
  });
